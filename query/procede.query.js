const QUERY = {
    CREATE_PROCEDE: `
        INSERT INTO procede_fabrication (Nom, Description, IDModele) 
        VALUES (?, ?, ?)
    `,
    GET_ALL_PROCEDE: `
        SELECT * 
        FROM procede_fabrication 
        JOIN modele_freezbee ON procede_fabrication.IDModele = modele_freezbee.IDModele
    `,
    GET_PROCEDE_BY_ID: `
        SELECT * 
        FROM procede_fabrication 
        JOIN modele_freezbee ON procede_fabrication.IDModele = modele_freezbee.IDModele 
        WHERE IDProcede = ?
    `,
    UPDATE_PROCEDE: `
        UPDATE procede_fabrication 
        SET Nom = ?, Description = ?, IDModele = ? 
        WHERE IDProcede = ?
    `,
    DELETE_PROCEDE: `
        DELETE FROM procede_fabrication 
        WHERE IDProcede = ?
    `
};

export default QUERY;