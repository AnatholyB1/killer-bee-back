import QUERY from "../query/procede.query.js";
import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';


const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };


// Get all procedes
export const getProcedes = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching procedes`);
    try {
      const [results] = await database.query(QUERY.GET_ALL_PROCEDE);
      if (!results.length) {
        res.setHeader('Content-Range', 'procedes 0-0/0');
        return res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No procedes found', []));
      }
      res.setHeader('Content-Range', `procedes 0-${results.length - 1}/${results.length}`);
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Procedes retrieved', results));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  };
  
  
    // Get procede by id
export const getProcede = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, fetching procede with id ${id}`);
    try {
      const [results] = await database.query(QUERY.GET_PROCEDE_BY_ID, [id]);
      if (!results.length) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Procede with id ${id} not found`));
      }
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Procede with id ${id} retrieved`, { procede: results[0] }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }

     
        // Create procede
export const createProcede = async (req, res) => {
    const { Nom, Description, IDModele } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, creating procede with name ${Nom}`);
    try {
      const [results] = await database.query(QUERY.CREATE_PROCEDE, [Nom, Description, IDModele]);
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, 'Procede created', { procede: { IDProcede: results.insertId, Nom, Description, IDModele } }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }

      
     // Update procede
export const updateProcede = async (req, res) => {
    const id = req.params.id;
    const { Nom, Description, IDModele } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, updating procede with id ${id}`);
    try {
      const [results] = await database.query(QUERY.UPDATE_PROCEDE, [Nom, Description, IDModele, id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Procede with id ${id} not found`));
      }
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Procede with id ${id} updated`, { procede: { IDProcede: id, Nom, Description, IDModele } }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }



        // Delete procede
export const deleteProcede = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, deleting procede with id ${id}`);
    try {
      const [results] = await database.query(QUERY.DELETE_PROCEDE, [id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Procede with id ${id} not found`));
      }
      res.status(HttpStatus.NO_CONTENT.code)
        .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Procede with id ${id} deleted`));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }