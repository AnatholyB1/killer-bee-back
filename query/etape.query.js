const QUERY = {
    // Get all etapes
    GET_ALL_ETAPE: `
        SELECT * 
        FROM etape
    `,
    
    // Get etape by id
    GET_ETAPE_BY_ID: `
        SELECT * 
        FROM etape 
        WHERE IDEtape = ?
    `,

    // Create etape
    CREATE_ETAPE: `
        INSERT INTO etape (Description, ValidationTest) 
        VALUES (?, ?)
    `,

    // Update etape by id
    UPDATE_ETAPE: `
        UPDATE etape 
        SET Description = ?, ValidationTest = ?
        WHERE IDEtape = ?
    `,

    // Delete etape by id
    DELETE_ETAPE: 'DELETE FROM etape WHERE IDEtape = ?'
};

export default QUERY;