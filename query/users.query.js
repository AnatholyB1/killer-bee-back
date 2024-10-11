const QUERY = {
    // Get all users with their roles
    GET_ALL_USERS: `
        SELECT u.IDUtilisateur, u.Nom, u.Prenom, u.Email, u.MotDePasse, r.NomRole 
        FROM utilisateur u
        JOIN role r ON u.IDRole = r.IDRole
    `,
    
    // Get user by id with their role
    GET_USER_BY_ID: `
        SELECT u.IDUtilisateur, u.Nom, u.Prenom, u.Email, u.MotDePasse, r.NomRole 
        FROM utilisateur u
        JOIN role r ON u.IDRole = r.IDRole
        WHERE u.IDUtilisateur = ?
    `,

    // Get user by email
    GET_USER_BY_EMAIL: `
        SELECT u.IDUtilisateur, u.Nom, u.Prenom, u.Email, u.MotDePasse, r.NomRole 
        FROM utilisateur u
        JOIN role r ON u.IDRole = r.IDRole
        WHERE u.Email = ?
    `,
    
    // Create user
    CREATE_USER: `
        INSERT INTO utilisateur (Nom, Prenom, Email, MotDePasse, IDRole) 
        VALUES (?, ?, ?, ?, ?)
    `,
    
    // Update user by id
    UPDATE_USER: `
        UPDATE utilisateur 
        SET Nom = ?, Prenom = ?, Email = ?, MotDePasse = ?, IDRole = ?
        WHERE IDUtilisateur = ?
    `,
    
    // Delete user by id
    DELETE_USER: 'DELETE FROM utilisateur WHERE IDUtilisateur = ?'
};

export default QUERY;