const QUERY = {
    CREATE_PROCEDE: `
        INSERT INTO procede_fabrication (Nom, Description, IDModele) 
        VALUES (?, ?, ?)
    `,
    GET_ALL_PROCEDE: `
    SELECT 
        pf.IDProcede,
        pf.Nom AS ProcedeNom,
        pf.Description AS ProcedeDescription,
        pf.IDModele,
        JSON_OBJECT(
            'IDModele', mf.IDModele,
            'Nom', mf.Nom,
            'Description', mf.Description,
            'PUHT', mf.PUHT,
            'Gamme', mf.Gamme
        ) AS model,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'IDEtape', e.IDEtape,
                'Description', e.Description,
                'ValidationTest', e.ValidationTest
            )
        ) AS etapes
    FROM procede_fabrication pf
    JOIN modele_freezbee mf ON pf.IDModele = mf.IDModele
    LEFT JOIN procedefabrication_freezbee pff ON pf.IDProcede = pff.IDProcede
    LEFT JOIN etape e ON pff.IDEtape = e.IDEtape
    GROUP BY pf.IDProcede, mf.IDModele
`,
GET_PROCEDE_BY_ID: `
SELECT 
    pf.IDProcede,
    pf.Nom AS ProcedeNom,
    pf.Description AS ProcedeDescription,
    pf.IDModele,
    JSON_OBJECT(
        'IDModele', mf.IDModele,
        'Nom', mf.Nom,
        'Description', mf.Description,
        'PUHT', mf.PUHT,
        'Gamme', mf.Gamme
    ) AS model,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'IDEtape', e.IDEtape,
            'Description', e.Description,
            'ValidationTest', e.ValidationTest
        )
    ) AS etapes
FROM procede_fabrication pf
JOIN modele_freezbee mf ON pf.IDModele = mf.IDModele
LEFT JOIN procedefabrication_freezbee pff ON pf.IDProcede = pff.IDProcede
LEFT JOIN etape e ON pff.IDEtape = e.IDEtape
WHERE pf.IDProcede = ?
GROUP BY pf.IDProcede, mf.IDModele
`,
    UPDATE_PROCEDE: `
        UPDATE procede_fabrication 
        SET Nom = ?, Description = ?, IDModele = ? 
        WHERE IDProcede = ?
    `,
    DELETE_PROCEDE: `
        DELETE FROM procede_fabrication 
        WHERE IDProcede = ?
    `,



        // Get all steps for a specific procedure
        GET_STEPS_BY_PROCEDE_ID: `
        SELECT e.*, pff.Quantite 
        FROM etape e
        JOIN procedefabrication_freezbee pff ON e.IDEtape = pff.IDEtape
        WHERE pff.IDProcede = ?
    `,

    // Add a step to a procedure
    ADD_STEP_TO_PROCEDE: `
        INSERT INTO procedefabrication_freezbee (IDProcede, IDEtape) 
        VALUES (?, ?)
    `,

    // Remove a step from a procedure
    REMOVE_STEP_FROM_PROCEDE: `
        DELETE FROM procedefabrication_freezbee 
        WHERE IDProcede = ? AND IDEtape = ?
    `,

    //remove all steps from a procedure
     REMOVE_ALL_STEPS_FROM_PROCEDE: `
        DELETE FROM procedefabrication_freezbee
         WHERE IDProcede = ?
     `,

};

export default QUERY;