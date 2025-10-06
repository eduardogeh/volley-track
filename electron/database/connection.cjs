const Database = require('better-sqlite3');
let db;

/**
 * Inicializa a conexão com o banco de dados.
 * Esta função será chamada pelo main.cjs DEPOIS de descobrir o caminho correto.
 * @param {string} dbPath - O caminho completo para o arquivo do banco de dados.
 */
function initDatabase(dbPath) {
    if (!db) {
        try {
            db = new Database(dbPath, { verbose: console.log });
            setupSchema();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        } catch (error) {
            console.error('Falha ao conectar ao banco de dados:', error);
            throw error;
        }
    }
    return db;
}

/**
 * Retorna a instância do banco de dados já conectada.
 * Os repositórios usarão esta função.
 */
function getDb() {
    if (!db) {
        throw new Error('A conexão com o banco de dados não foi inicializada.');
    }
    return db;
}

/**
 * Cria as tabelas se elas não existirem.
 * Movido para uma função separada para ser chamada após a conexão.
 */
function setupSchema() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS teams (
                                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                                             name TEXT NOT NULL,
                                             logo TEXT,
                                             color TEXT
        );

        CREATE TABLE IF NOT EXISTS players (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               name TEXT NOT NULL,
                                               number INTEGER,
                                               height TEXT,
                                               position TEXT,
                                               team_id INTEGER NOT NULL,
                                               player_order INTEGER NOT NULL,
                                               photo TEXT,
                                               FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
            );

        CREATE TABLE IF NOT EXISTS scout_models (
                                                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                    name TEXT NOT NULL,
                                                    grid_width INTEGER NOT NULL DEFAULT 4,
                                                    grid_height INTEGER NOT NULL DEFAULT 3
        );

        CREATE TABLE IF NOT EXISTS categories (
                                                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                  model_id INTEGER NOT NULL,
                                                  name TEXT NOT NULL,
                                                  color TEXT DEFAULT '#cccccc',
                                                  time_to_clip_before_event INTEGER NOT NULL DEFAULT 5, -- <<< NOVO
                                                  time_to_clip_after_event INTEGER NOT NULL DEFAULT 5,  -- <<< NOVO
                                                  FOREIGN KEY (model_id) REFERENCES scout_models (id) ON DELETE CASCADE
            );

        CREATE TABLE IF NOT EXISTS subcategories (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     category_id INTEGER NOT NULL,
                                                     name TEXT NOT NULL,
                                                     type TEXT NOT NULL,
                                                     weight REAL NOT NULL DEFAULT 0,
                                                     FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE
            );

        CREATE TABLE IF NOT EXISTS projects (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                season TEXT NOT NULL,
                                                tournament TEXT NOT NULL,
                                                description TEXT,
                                                id_team INTEGER NOT NULL,
                                                id_scout_model INTEGER NOT NULL,
                                                video_path TEXT,
                                                FOREIGN KEY (id_team) REFERENCES teams (id) ON DELETE CASCADE,
            FOREIGN KEY (id_scout_model) REFERENCES scout_models (id) ON DELETE CASCADE
            );

        CREATE TABLE IF NOT EXISTS player_actions (
                                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                      project_id INTEGER NOT NULL,
                                                      player_id INTEGER NOT NULL,
                                                      resultado_id INTEGER NOT NULL,
                                                      zona_id INTEGER NOT NULL,
                                                      clip_start REAL NOT NULL,
                                                      clip_end REAL NOT NULL,
                                                      FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
            FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE,
            FOREIGN KEY (resultado_id) REFERENCES subcategories (id) ON DELETE CASCADE,
            FOREIGN KEY (zona_id) REFERENCES subcategories (id) ON DELETE CASCADE
            );
    `);
    console.log('Schema do banco de dados verificado/configurado.');
}

module.exports = { initDatabase, getDb };