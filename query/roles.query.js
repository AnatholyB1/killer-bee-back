const QUERY =  {

    GET_ROLE: 'SELECT * FROM role WHERE IDRole = ?',
    CREATE_ROLE: 'INSERT INTO role (NomRole) VALUES (?)',
    UPDATE_ROLE: 'UPDATE role SET NomRole = ? WHERE IDRole = ?',
    DELETE_ROLE: 'DELETE FROM role WHERE IDRole = ?',
    LIST_ROLES: 'SELECT * FROM role'
    };

export default QUERY;