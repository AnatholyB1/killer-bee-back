import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from "../query/etape.query.js";


const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };


// Get all etapes
export const getEtapes = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching etapes`);
    try {
      const [results] = await database.query(QUERY.GET_ALL_ETAPE);
      if (!results.length) {
        res.setHeader('Content-Range', 'etapes 0-0/0');
        return res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No etapes found', []));
      }
      res.setHeader('Content-Range', `etapes 0-${results.length - 1}/${results.length}`);
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Etapes retrieved', results));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  };
  

    // Get etape by id

export const getEtape = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, fetching etape with id ${id}`);
    try {
      const [results] = await database.query(QUERY.GET_ETAPE_BY_ID, [id]);
      if (!results.length) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Etape with id ${id} not found`));
      }
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Etape with id ${id} retrieved`, { etape: results[0] }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }


    // Create etape
export const createEtape = async (req, res) => {
    const { Description, ValidationTest, IDProcede } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, creating etape with description ${Description}`);
    try {
      const [results] = await database.query(QUERY.CREATE_ETAPE, [Description, ValidationTest, IDProcede]);
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, 'Etape created', { etape: { IDEtape: results.insertId, Description, ValidationTest, IDProcede } }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }


    // Update etape by id
export const updateEtape = async (req, res) => {
    const id = req.params.id;
    const { Description, ValidationTest, IDProcede } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, updating etape with id ${id}`);
    try {
      const [results] = await database.query(QUERY.UPDATE_ETAPE, [Description, ValidationTest, IDProcede, id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Etape with id ${id} not found`));
      }
      res.status(HttpStatus.NO_CONTENT.code)
        .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Etape with id ${id} updated`));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }


    // Delete etape by id
export const deleteEtape = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, deleting etape with id ${id}`);
    try {
      const [results] = await database.query(QUERY.DELETE_ETAPE, [id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Etape with id ${id} not found`));
      }
      res.status(HttpStatus.NO_CONTENT.code)
        .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Etape with id ${id} deleted`));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }