const { getDb } = require('./connection.cjs');

function getDynamicMatchReport(projectId) {
    const db = getDb();

    const modelStructure = db.prepare(`
        SELECT
            c.name as categoryName,
            s.name as subCategoryName,
            s.weight as subCategoryWeight
        FROM projects p
                 JOIN categories c ON p.id_scout_model = c.model_id
                 JOIN subcategories s ON c.id = s.category_id
        WHERE p.id = ? AND s.type = 'resultado'
        ORDER BY c.id, s.id
    `).all(projectId);

    if (modelStructure.length === 0) {
        return { headers: {}, data: [], modelStructure: [] };
    }

    const actions = db.prepare(`
        SELECT
            p.id as playerId,
            c.name as categoryName,
            res.name as resultadoName
        FROM player_actions pa
        JOIN players p ON pa.player_id = p.id
        JOIN subcategories res ON pa.resultado_id = res.id
        JOIN categories c ON res.category_id = c.id
        WHERE pa.project_id = ?
    `).all(projectId);

    const activeCategoryNames = new Set(actions.map(a => a.categoryName));
    if (activeCategoryNames.size === 0) {
        const allPlayers = db.prepare('SELECT p.id as playerId, p.name as playerName, p.number as playerNumber FROM players p JOIN projects pj ON p.team_id = pj.id_team WHERE pj.id = ? ORDER BY p.player_order').all(projectId);
        return { headers: {}, data: allPlayers.map(p => ({ ...p, actions: {} })), modelStructure };
    }

    const headers = modelStructure.reduce((acc, row) => {
        if (activeCategoryNames.has(row.categoryName)) {
            if (!acc[row.categoryName]) {
                acc[row.categoryName] = [];
            }
            if (!acc[row.categoryName].includes(row.subCategoryName)) {
                acc[row.categoryName].push(row.subCategoryName);
            }
        }
        return acc;
    }, {});

    const playerData = new Map();
    const allPlayers = db.prepare('SELECT p.id as playerId, p.name as playerName, p.number as playerNumber, p.player_order FROM players p JOIN projects pj ON p.team_id = pj.id_team WHERE pj.id = ? ORDER BY p.player_order').all(projectId);

    for (const player of allPlayers) {
        const playerEntry = {
            playerId: player.playerId,
            playerName: player.playerName,
            playerNumber: player.playerNumber,
            actions: {}
        };

        for (const category in headers) {
            playerEntry.actions[category] = {};
            for (const subCat of headers[category]) {
                playerEntry.actions[category][subCat] = 0;
            }
        }
        playerData.set(player.playerId, playerEntry);
    }

    for (const action of actions) {
        const player = playerData.get(action.playerId);
        if (player && player.actions[action.categoryName]) {
            player.actions[action.categoryName][action.resultadoName]++;
        }
    }

    const finalReportData = Array.from(playerData.values());

    return { headers, data: finalReportData, modelStructure };
}

module.exports = { getDynamicMatchReport };