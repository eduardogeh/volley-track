const db = require('./connection.cjs');

const teamRepository = {
    create(team) {
        const defaultTeam = {
            name: 'Nova Equipe',
            logo: null,
            color: '#cccccc',
            ...team,
        };
        const stmt = db.prepare('INSERT INTO teams (name, logo, color) VALUES (@name, @logo, @color)');
        const info = stmt.run(defaultTeam);
        return info.lastInsertRowid;
    },

    getAll() {
        return db.prepare('SELECT * FROM teams').all();
    },

    getById(id) {
        return db.prepare('SELECT * FROM teams WHERE id = ?').get(id);
    },

    update(team) {
        const stmt = db.prepare('UPDATE teams SET name = ?, logo = ?, color = ? WHERE id = ?');
        stmt.run(team.name, team.logo, team.color, team.id);
    },

    delete(id) {
        // Graças ao 'ON DELETE CASCADE', os jogadores associados serão removidos automaticamente.
        return db.prepare('DELETE FROM teams WHERE id = ?').run(id);
    },
};

module.exports = teamRepository;