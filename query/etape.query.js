const QUERY = {
    // Get all etapes
    GET_ALL_ETAPE: `
        SELECT * 
        FROM etape
        JOIN procede_fabrication ON etape.IDProcede = procede_fabrication.IDProcede
    `,
    
    // Get etape by id
    GET_ETAPE_BY_ID: `
        SELECT * 
        FROM etape 
        WHERE IDEtape = ?
        JOIN procede_fabrication ON etape.IDProcede = procede_fabrication.IDProcede
    `,

    // Create etape
    CREATE_ETAPE: `
        INSERT INTO etape (Description, ValidationTest, IDProcede) 
        VALUES (?, ?, ?)
    `,

    // Update etape by id
    UPDATE_ETAPE: `
        UPDATE etape 
        SET Description = ?, ValidationTest = ?, IDProcede = ? 
        WHERE IDEtape = ?
    `,

    // Delete etape by id
    DELETE_ETAPE: 'DELETE FROM etape WHERE IDEtape = ?'
};

export default QUERY;