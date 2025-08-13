// electron/database/scoutItemRepository.cjs
const db = require('./connection.cjs');

function getItemsByScoutId(scoutId) {
    const items = db.prepare('SELECT * FROM scout_items WHERE scout_id = ?').all(scoutId);

    // Para cada item, buscamos suas categorias e sub-categorias
    const categoryStmt = db.prepare('SELECT * FROM categories WHERE item_id = ? AND type = ?');

    return items.map(item => ({
        ...item,
        categories: categoryStmt.all(item.id, 'main'),
        subCategories: categoryStmt.all(item.id, 'sub'),
    }));
}

module.exports = {
    getByScoutId: getItemsByScoutId,
    // ... create, update, delete para itens e categorias
};