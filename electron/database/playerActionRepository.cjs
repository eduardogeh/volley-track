const { getDb } = require('./connection.cjs');

/**
 * Cria uma nova ação de jogador no banco de dados.
 */
function create(action) {
    const db = getDb();
    const { project_id, player_id, resultado_id, zona_id, clip_start, clip_end } = action;
    const stmt = db.prepare(
        'INSERT INTO player_actions (project_id, player_id, resultado_id, zona_id, clip_start, clip_end) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const info = stmt.run(project_id, player_id, resultado_id, zona_id, clip_start, clip_end);
    return info.lastInsertRowid;
}

/**
 * Busca todas as ações de um projeto, já com os nomes do jogador e das categorias.
 */
function getByProjectId(projectId) {
    const db = getDb();
    const stmt = db.prepare(`
        SELECT
            pa.id,
            pa.clip_start,
            pa.clip_end,
            p.name as playerName,
            p.number as playerNumber,
            p.photo as playerPhoto,
            c.name as categoryName,
            c.color as categoryColor,
            res.name as resultadoName,
            zon.name as zonaName
        FROM
            player_actions pa
        JOIN
            players p ON pa.player_id = p.id
        JOIN
            subcategories res ON pa.resultado_id = res.id
        JOIN
            subcategories zon ON pa.zona_id = zon.id
        JOIN
            categories c ON res.category_id = c.id
        WHERE
            pa.project_id = ?
        ORDER BY
            pa.clip_start ASC
    `);

    return stmt.all(projectId).map(row => ({
        id: row.id,
        playerName: row.playerName,
        playerNumber: row.playerNumber,
        playerPhoto: row.playerPhoto,
        actionDescription: `${row.categoryName}  ${row.resultadoName}`,
        resultadoName: row.resultadoName,
        zonaName: row.zonaName,
        categoryName: row.categoryName,
        categoryColor: row.categoryColor,
        clipStart: row.clip_start,
        clipEnd: row.clip_end
    }));
}

/**
 * Deleta uma ação de jogador pelo seu ID.
 */
function deleteAction(actionId) {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM player_actions WHERE id = ?');
    const info = stmt.run(actionId);
    return info.changes > 0;
}

module.exports = { create, getByProjectId, delete: deleteAction };