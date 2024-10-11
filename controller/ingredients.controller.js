import QUERY from "../query/ingredients.query.js";
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


// Get all ingredients
export const getIngredients = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching ingredients`);
    try {
      const [results] = await database.query(QUERY.SELECT_ALL_INGREDIENTS);
      if (!results.length) {
        res.setHeader('Content-Range', 'ingredients 0-0/0');
        return res.status(HttpStatus.OK.code)
          .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No ingredients found', []));
      }
      res.setHeader('Content-Range', `ingredients 0-${results.length - 1}/${results.length}`);
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Ingredients retrieved', results));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  };
  
  
    // Get ingredient by id
export const getIngredient = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, fetching ingredient with id ${id}`);
    try {
      const [results] = await database.query(QUERY.SELECT_INGREDIENT_BY_ID, [id]);
      if (!results.length) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Ingredient with id ${id} not found`));
      }
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Ingredient with id ${id} retrieved`, { ingredient: results[0] }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }

 
    // Create ingredient
export const createIngredient = async (req, res) => {
    const { Nom, Description, Grammage } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, creating ingredient with name ${Nom}`);
    try {
      const [results] = await database.query(QUERY.CREATE_INGREDIENT, [Nom, Description, Grammage]);
      res.status(HttpStatus.CREATED.code)
        .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Ingredient with name ${Nom} created`, { ingredient: { Nom, Description, Grammage } }));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }


    // Update ingredient by id
export const updateIngredient = async (req, res) => {
    const id = req.params.id;
    const { Nom, Description, Grammage } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, updating ingredient with id ${id}`);
    try {
      const [results] = await database.query(QUERY.UPDATE_INGREDIENT, [Nom, Description, Grammage, id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Ingredient with id ${id} not found`));
      }
      res.status(HttpStatus.NO_CONTENT.code)
        .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Ingredient with id ${id} updated`));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }

    // Delete ingredient by id
export const deleteIngredient = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, deleting ingredient with id ${id}`);
    try {
      const [results] = await database.query(QUERY.DELETE_INGREDIENT, [id]);
      if (!results.affectedRows) {
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Ingredient with id ${id} not found`));
      }
      res.status(HttpStatus.NO_CONTENT.code)
        .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Ingredient with id ${id} deleted`));
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
  }