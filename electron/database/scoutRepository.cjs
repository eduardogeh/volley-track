// electron/database/scoutRepository.cjs
const db = require('./connection.cjs');

const scoutRepository = {
    getAll: () => db.prepare('SELECT * FROM scout_models').all(),
    create: () => {},
    delete: (id) => {},
};

module.exports = scoutRepository;