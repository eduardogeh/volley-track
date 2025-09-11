const { getDb } = require('./connection.cjs');

const scoutRepository = {
    getAll: () => {
        const db = getDb();
        const models = db.prepare('SELECT * FROM scout_models').all();

        const categoryStmt = db.prepare('SELECT * FROM categories WHERE model_id = ?');
        const subcategoryStmt = db.prepare('SELECT * FROM subcategories WHERE category_id = ?');

        return models.map(model => {
            const categories = categoryStmt.all(model.id);
            const categoriesWithSubcategories = categories.map(category => {
                return {
                    ...category,
                    subcategories: subcategoryStmt.all(category.id)
                };
            });
            return {
                ...model,
                categories: categoriesWithSubcategories
            };
        });
    },

    /**
     * Salva ou atualiza um modelo de scout completo e seus dados aninhados.
     * Usa uma transação para garantir a integridade dos dados.
     * @param {object} model - O objeto ScoutModel completo vindo do frontend.
     */
    save: (model) => {
        try {
            const db = getDb();
            const transaction = db.transaction((modelData) => {
                let modelId = modelData.id;

                if (modelId) {
                    db.prepare('UPDATE scout_models SET name = ?, grid_width = ? WHERE id = ?')
                        .run(modelData.name, modelData.grid_width, modelId);
                } else {
                    const result = db.prepare('INSERT INTO scout_models (name, grid_width) VALUES (?, ?)')
                        .run(modelData.name, modelData.grid_width);
                    modelId = result.lastInsertRowid;
                }

                db.prepare('DELETE FROM categories WHERE model_id = ?').run(modelId);

                const categoryStmt = db.prepare(`
                INSERT INTO categories 
                    (model_id, name, color, time_to_clip_before_event, time_to_clip_after_event) 
                VALUES (?, ?, ?, ?, ?)
            `);
                const subcategoryStmt = db.prepare('INSERT INTO subcategories (category_id, name, type, weight) VALUES (?, ?, ?, ?)');

                for (const category of modelData.categories) {
                    const categoryResult = categoryStmt.run(
                        modelId,
                        category.name,
                        category.color,
                        category.time_to_clip_before_event || 4,
                        category.time_to_clip_after_event || 4
                    );
                    const categoryId = categoryResult.lastInsertRowid;

                    for (const subcategory of category.subcategories) {
                        subcategoryStmt.run(categoryId, subcategory.name, subcategory.type, subcategory.weight);
                    }
                }

                return modelId;
            });
            return transaction(model);
        } catch (e) {
            console.error('Erro ao salvar o modelo de scout:', e);
            throw e;
        }
    },

    delete: (id) => {
        return getDb().prepare('DELETE FROM scout_models WHERE id = ?').run(id);
    },
};

module.exports = scoutRepository;