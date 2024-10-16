const QUERY = {
    // Get all models
    GET_ALL_MODELS: `
    SELECT 
        mf.IDModele, 
        mf.Nom, 
        mf.Description, 
        mf.PUHT, 
        mf.Gamme, 
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'IDingredient', i.IDingredient,
                'Nom', i.Nom,
                'Description', i.Description,
                'Quantite', mfi.Quantite
            )
        ) AS ingredients
    FROM modele_freezbee mf
    LEFT JOIN modele_freezbee_ingredient mfi ON mf.IDModele = mfi.IDModele
    LEFT JOIN ingredient i ON mfi.IDingredient = i.IDingredient
    GROUP BY mf.IDModele
`,
    
    // Get model by id
    GET_MODEL_BY_ID: 'SELECT * FROM modele_freezbee WHERE IDModele = ?',
    
    // Create model
    CREATE_MODEL: `
        INSERT INTO modele_freezbee (Nom, Description, PUHT, Gamme) 
        VALUES (?, ?, ?, ?)
    `,
    
    // Update model by id
    UPDATE_MODEL: `
        UPDATE modele_freezbee 
        SET Nom = ?, Description = ?, PUHT = ?, Gamme = ? 
        WHERE IDModele = ?
    `,
    
    // Delete model by id
    DELETE_MODEL: 'DELETE FROM modele_freezbee WHERE IDModele = ?',

    // Get all ingredients for a specific model
    GET_INGREDIENTS_BY_MODEL_ID: `
    SELECT 
        i.*, 
        mfi.Quantite 
    FROM ingredient i
    JOIN modele_freezbee_ingredient mfi ON i.IDingredient = mfi.IDingredient
    WHERE mfi.IDModele = ?
`,

    // Add an ingredient to a model
    ADD_INGREDIENT_TO_MODEL: `
        INSERT INTO modele_freezbee_ingredient (IDModele, IDingredient, Quantite) 
        VALUES (?, ?, ?)
    `,

    // Remove an ingredient from a model
    REMOVE_INGREDIENT_FROM_MODEL: `
        DELETE FROM modele_freezbee_ingredient 
        WHERE IDModele = ? AND IDingredient = ?
    `,

    //remove all ingredients from a model
    REMOVE_ALL_INGREDIENTS_FROM_MODEL: `
        DELETE FROM modele_freezbee_ingredient 
        WHERE IDModele = ?
    `,
};

export default QUERY;