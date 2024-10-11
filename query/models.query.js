const QUERY = {
    // Get all models
    GET_ALL_MODELS: 'SELECT * FROM modele_freezbee',
    
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
    DELETE_MODEL: 'DELETE FROM modele_freezbee WHERE IDModele = ?'
};

export default QUERY;