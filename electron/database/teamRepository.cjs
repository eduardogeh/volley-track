const {getDb} = require('./connection.cjs');

const teamRepository = {
    create(team) {
        const defaultTeam = {
            name: 'Nova Equipe',
            logo: null,
            color: '#cccccc',
            ...team,
        };
        const stmt = getDb.prepare('INSERT INTO teams (name, logo, color) VALUES (@name, @logo, @color)');
        const info = stmt.run(defaultTeam);
        return info.lastInsertRowid;
    },

    getAll() {
        return getDb.prepare('SELECT * FROM teams').all();
    },

    getById(id) {
        return getDb.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    },

    update(team) {
        const stmt = getDb.prepare('UPDATE teams SET name = ?, logo = ?, color = ? WHERE id = ?');
        stmt.run(team.name, team.logo, team.color, team.id);
    },

    delete(id) {
        // Graças ao 'ON DELETE CASCADE', os jogadores associados serão removidos automaticamente.
        return getDb.prepare('DELETE FROM teams WHERE id = ?').run(id);
    },
};

module.exports = teamRepository;