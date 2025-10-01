const { getDb } = require('./connection.cjs');

const projectRepository = {
    /**
     * Retorna todos os projetos, ordenados pela temporada e campeonato.
     * @returns {Project[]}
     */
    getAll() {
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM projects ORDER BY season DESC, tournament ASC');
        return stmt.all();
    },

    getById(id) {
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
        return stmt.get(id);
    },

    create(project) {
        const db = getDb();
        // <<< ATUALIZADO para incluir video_path >>>
        const { season, tournament, description, id_team, id_scout_model, video_path } = project;
        const stmt = db.prepare(
            'INSERT INTO projects (season, tournament, description, id_team, id_scout_model, video_path) VALUES (?, ?, ?, ?, ?, ?)'
        );
        const info = stmt.run(season, tournament, description, id_team, id_scout_model, video_path || null);
        return info.lastInsertRowid;
    },

    update(project) {
        const db = getDb();
        // <<< ATUALIZADO para incluir video_path >>>
        const { id, season, tournament, description, id_team, id_scout_model, video_path } = project;
        const stmt = db.prepare(
            'UPDATE projects SET season = ?, tournament = ?, description = ?, id_team = ?, id_scout_model = ?, video_path = ? WHERE id = ?'
        );
        stmt.run(season, tournament, description, id_team, id_scout_model, video_path || null, id);
    },

    /**
     * Deleta um projeto pelo seu ID.
     * @param {number} projectId - O ID do projeto a ser deletado.
     */
    delete(projectId) {
        const db = getDb();
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
        stmt.run(projectId);
    }
};

module.exports = projectRepository;