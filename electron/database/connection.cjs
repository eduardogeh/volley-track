const path = require('path');
const Database = require('better-sqlite3');

// Resolve the path to the database file.
// Using __dirname ensures the path is correct relative to the script's location.
const isProd = process.env.NODE_ENV === 'production';

const dbPath = isProd
    ? path.join(process.resourcesPath, 'volei_manager.sqlite')
    : path.resolve(__dirname, 'volei_manager.sqlite');

// Initialize the database connection.
// The 'verbose' option will log all executed SQL statements to the console.
const db = new Database(dbPath, { verbose: console.log });

/**
 * Sets up the database schema by creating all necessary tables if they don't already exist.
 */
function setupDatabase() {
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
    `);
    console.log('Banco de dados configurado com sucesso.');
}

// Run the setup function immediately when the script is loaded.
setupDatabase();

// Export the database connection for use in other parts of the application.
module.exports = db;
