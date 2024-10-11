import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/users.query.js';
import RoleQuery from '../query/roles.query.js';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };


  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
};


const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Get all users
export const getUsers = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching users`);
  
  try {
    const [results] = await database.query(QUERY.GET_ALL_USERS);
    
    if (!results.length) {
      res.setHeader('Content-Range', 'users 0-0/0');
      return res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No users found', []));
    }
    
    res.setHeader('Content-Range', `users 0-${results.length - 1}/${results.length}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Users retrieved', results));
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Get user by id
export const getUser = async (req, res) => {
  const id = req.params.id;
  logger.info(`${req.method} ${req.originalUrl}, fetching user with id ${id}`);

  try {
    const [results] = await database.query(QUERY.GET_USER_BY_ID, [id]);

    if (!results.length) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User with id ${id} not found`));
    }

    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User with id ${id} retrieved`, { user: results[0] }));
  } catch (error) {
    console.error(error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};


// Create user
export const createUser = async (req, res) => {
  const { Nom, Prenom, Email, MotDePasse, IDRole } = req.body;

  if (!validateEmail(Email)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Invalid email format'));
  }
  if (!validatePassword(MotDePasse)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Password does not meet security requirements'));
  }

  logger.info(`${req.method} ${req.originalUrl}, creating user with name ${Nom}`);

  try {
      // Check if role exists with the given ID
      const [roleResults] = await database.query(RoleQuery.GET_ROLE, [IDRole]);
      if (!roleResults.length) {
          return res.status(HttpStatus.NOT_FOUND.code)
              .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Role with id ${IDRole} not found`));
      }

      // Create user after role validation
      const [userResults] = await database.query(QUERY.CREATE_USER, [Nom, Prenom, Email, MotDePasse, IDRole]);
      res.status(HttpStatus.CREATED.code)
          .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `User with name ${Nom} created`, { user: { Nom, Prenom, Email, MotDePasse, IDRole } }));
  } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};


// Update user by id
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { Nom, Prenom, Email, MotDePasse, IDRole } = req.body;

  if (Email && !validateEmail(Email)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Invalid email format'));
  }
  if (MotDePasse && !validatePassword(MotDePasse)) {
      return res.status(HttpStatus.BAD_REQUEST.code)
          .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Password does not meet security requirements'));
  }

  logger.info(`${req.method} ${req.originalUrl}, updating user with id ${id}`);

  try {
      // Check if role exists with the given ID
      if (IDRole) {
          const [roleResults] = await database.query(RoleQuery.GET_ROLE, [IDRole]);
          if (!roleResults.length) {
              return res.status(HttpStatus.NOT_FOUND.code)
                  .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Role with id ${IDRole} not found`));
          }
      }

      // Update user after role validation
      const [results] = await database.query(QUERY.UPDATE_USER, [Nom, Prenom, Email, MotDePasse, IDRole, id]);
      res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `User with id ${id} updated`, { user: { Nom, Prenom, Email, MotDePasse, IDRole } }));
  } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Delete user by id
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  logger.info(`${req.method} ${req.originalUrl}, deleting user with id ${id}`);

  try {
      const [results] = await database.query(QUERY.DELETE_USER, [id]);

      if (results.affectedRows === 0) {
          return res.status(HttpStatus.NOT_FOUND.code)
              .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User with id ${id} not found`));
      }

      res.status(HttpStatus.NO_CONTENT.code)
          .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `User with id ${id} deleted`));
  } catch (error) {
      logger.error(`Error deleting user with id ${id}: ${error.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
          .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};