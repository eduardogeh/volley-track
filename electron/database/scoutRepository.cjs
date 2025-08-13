// electron/database/scoutRepository.cjs
const {getDb} = require('./connection.cjs');

const scoutRepository = {
    getAll: () => getDb().prepare('SELECT * FROM scout_models').all(),
    create: () => {},
    delete: (id) => {},
};

module.exports = scoutRepository;