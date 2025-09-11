const {getDb} = require('./connection.cjs');

const playerRepository = {
    create(player) {
        const orderResult = getDb().prepare('SELECT COUNT(*) as count FROM players WHERE team_id = ?').get(player.team_id);
        const nextOrder = orderResult.count;

        const stmt = getDb().prepare(`
            INSERT INTO players (name, number, height, position, team_id, player_order, photo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        const info = stmt.run(player.name, player.number, player.height, player.position, player.team_id, nextOrder, player.photo);
        return info.lastInsertRowid;
    },

    getByTeamId(teamId) {
        return getDb().prepare('SELECT * FROM players WHERE team_id = ? ORDER BY player_order ASC').all(teamId);
    },

    updateOrder(teamId, orderedPlayerIds) {
        const updateStmt = getDb().prepare('UPDATE players SET player_order = ? WHERE id = ? AND team_id = ?');

        const transaction = getDb().transaction(() => {
            for (let i = 0; i < orderedPlayerIds.length; i++) {
                const playerId = orderedPlayerIds[i];
                const newOrder = i;
                updateStmt.run(newOrder, playerId, teamId);
            }
        });

        transaction();
    },

    update(player) {
        const stmt = getDb().prepare('UPDATE players SET name = ?, number = ?, height = ?, position = ?, photo = ? WHERE id = ?');
        stmt.run(player.name, player.number, player.height, player.position, player.photo, player.id);
    },

    delete(id) {
        const playerToDelete = getDb().prepare('SELECT team_id, player_order FROM players WHERE id = ?').get(id);
        if (!playerToDelete) return;

        const transaction = getDb().transaction(() => {
            getDb().prepare('DELETE FROM players WHERE id = ?').run(id);

            const updateStmt = getDb().prepare(`
                UPDATE players
                SET player_order = player_order - 1
                WHERE team_id = ? AND player_order > ?
            `);
            updateStmt.run(playerToDelete.team_id, playerToDelete.player_order);
        });

        transaction();
    },
};

module.exports = playerRepository;