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

    getById: (id) => {
        const db = getDb();
        const model = db.prepare('SELECT * FROM scout_models WHERE id = ?').get(id);
        if (!model) return null;

        const categories = db.prepare('SELECT * FROM categories WHERE model_id = ?').all(id);
        const subcategoryStmt = db.prepare('SELECT * FROM subcategories WHERE category_id = ?');

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
    },

    /**
     * Salva ou atualiza um modelo de scout, sincronizando categorias e subcategorias
     * sem deletar e recriar tudo, preservando os IDs e relacionamentos existentes.
     * @param {object} model - O objeto ScoutModel completo vindo do frontend.
     */
    save: (model) => {
        const db = getDb();
        console.log('Salvando modelo de scout:', JSON.stringify(model, null, 2));
        const transaction = db.transaction((modelData) => {
            let modelId = modelData.id;

            // 1. ATUALIZA OU INSERE O MODELO PRINCIPAL (SCOUT_MODEL)
            if (modelId) {
                db.prepare('UPDATE scout_models SET name = ?, grid_width = ?, grid_height = ? WHERE id = ?')
                    .run(modelData.name, modelData.grid_width, modelData.grid_height, modelId);
            } else {
                const result = db.prepare('INSERT INTO scout_models (name, grid_width, grid_height) VALUES (?, ?, ?)')
                    .run(modelData.name, modelData.grid_width, modelData.grid_height);
                modelId = result.lastInsertRowid;
            }

            // --- SINCRONIZAÇÃO DE CATEGORIAS ---

            // 2. BUSCA OS IDs DAS CATEGORIAS EXISTENTES NO BANCO PARA ESTE MODELO
            const existingCategoriesStmt = db.prepare('SELECT id FROM categories WHERE model_id = ?');
            const existingCategoryIds = existingCategoriesStmt.all(modelId).map(c => c.id);

            // 3. PEGA OS IDs DAS CATEGORIAS QUE VIERAM DO FRONTEND
            const incomingCategoryIds = modelData.categories.map(c => c.id).filter(id => id); // Filtra IDs nulos/undefined

            // 4. DETERMINA QUAIS CATEGORIAS DEVEM SER DELETADAS
            const categoriesToDelete = existingCategoryIds.filter(id => !incomingCategoryIds.includes(id));
            if (categoriesToDelete.length > 0) {
                // 'IN' clause precisa de um tratamento especial para o better-sqlite3
                const placeholders = categoriesToDelete.map(() => '?').join(',');
                db.prepare(`DELETE FROM categories WHERE id IN (${placeholders})`).run(...categoriesToDelete);
            }

            // 5. ATUALIZA AS CATEGORIAS EXISTENTES E INSERE AS NOVAS
            for (const category of modelData.categories) {
                let categoryId = category.id;

                if (categoryId) {
                    // UPDATE se a categoria já tem um ID
                    db.prepare(`UPDATE categories SET name = ?, color = ?, time_to_clip_before_event = ?, time_to_clip_after_event = ? WHERE id = ?`)
                        .run(category.name, category.color, category.time_to_clip_before_event, category.time_to_clip_after_event, categoryId);
                } else {
                    // INSERT se for uma nova categoria (sem ID)
                    const result = db.prepare(`INSERT INTO categories (model_id, name, color, time_to_clip_before_event, time_to_clip_after_event) VALUES (?, ?, ?, ?, ?)`)
                        .run(modelId, category.name, category.color, category.time_to_clip_before_event, category.time_to_clip_after_event);
                    categoryId = result.lastInsertRowid;
                }

                // --- SINCRONIZAÇÃO DE SUBCATEGORIAS (Lógica idêntica, mas para subcategorias) ---
                const existingSubcategoriesStmt = db.prepare('SELECT id FROM subcategories WHERE category_id = ?');
                const existingSubcategoryIds = existingSubcategoriesStmt.all(categoryId).map(sc => sc.id);
                const incomingSubcategoryIds = category.subcategories.map(sc => sc.id).filter(id => id);

                const subcategoriesToDelete = existingSubcategoryIds.filter(id => !incomingSubcategoryIds.includes(id));
                if (subcategoriesToDelete.length > 0) {
                    const placeholders = subcategoriesToDelete.map(() => '?').join(',');
                    db.prepare(`DELETE FROM subcategories WHERE id IN (${placeholders})`).run(...subcategoriesToDelete);
                }

                for (const subcategory of category.subcategories) {
                    if (subcategory.id) {
                        // UPDATE
                        db.prepare('UPDATE subcategories SET name = ?, type = ?, weight = ? WHERE id = ?')
                            .run(subcategory.name, subcategory.type, subcategory.weight, subcategory.id);
                    } else {
                        // INSERT
                        db.prepare('INSERT INTO subcategories (category_id, name, type, weight) VALUES (?, ?, ?, ?)')
                            .run(categoryId, subcategory.name, subcategory.type, subcategory.weight);
                    }
                }
            }

            return modelId;
        });

        try {
            return transaction(model);
        } catch (e) {
            console.error('Erro ao sincronizar o modelo de scout:', e);
            throw e;
        }
    },

    delete: (id) => {
        return getDb().prepare('DELETE FROM scout_models WHERE id = ?').run(id);
    },
};

module.exports = scoutRepository;