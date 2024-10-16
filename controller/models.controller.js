import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/models.query.js';

const HttpStatus = {
  OK: { code: 200, status: 'OK' },
  CREATED: { code: 201, status: 'CREATED' },
  NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
  BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
  NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
  INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

// Get all models
export const getModels = async (req, res) => {
  logger.info(`${req.method} ${req.originalUrl}, fetching models`);
  try {
    const [results] = await database.query(QUERY.GET_ALL_MODELS);
    if (!results.length) {
      res.setHeader('Content-Range', 'models 0-0/0');
      return res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No models found', []));
    }
    res.setHeader('Content-Range', `models 0-${results.length - 1}/${results.length}`);
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Models retrieved', results));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Get model by id
export const getModel = async (req, res) => {
  const id = req.params.id;
  logger.info(`${req.method} ${req.originalUrl}, fetching model with id ${id}`);
  try {
    const [results] = await database.query(QUERY.GET_MODEL_BY_ID, [id]);
    const [ingredients] = await database.query(QUERY.GET_INGREDIENTS_BY_MODEL_ID, [id])

    results[0].ingredients = ingredients;
    if (!results.length) {
      return res.status(HttpStatus.NOT_FOUND.code)
        .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Model with id ${id} not found`));
    }
    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Model with id ${id} retrieved`, { model: results[0] }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Create model
export const createModel = async (req, res) => {
  const { Nom, Description, PUHT, Gamme, ingredients } = req.body;
  logger.info(`${req.method} ${req.originalUrl}, creating model with name ${Nom}`);
  
  try {
    const [results] = await database.query(QUERY.CREATE_MODEL, [Nom, Description, PUHT, Gamme]);

    if (ingredients) {
      const ingredientPromises = ingredients.map(ingredient => 
        database.query(QUERY.ADD_INGREDIENT_TO_MODEL, [results.insertId, ingredient.id, ingredient.quantite])
      );

      await Promise.all(ingredientPromises);
    }

    res.status(HttpStatus.CREATED.code)
      .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Model with name ${Nom} created`, { model: { Nom, Description, PUHT, Gamme } }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Update model by id
export const updateModel = async (req, res) => {
  const id = req.params.id;
  const { Nom, Description, PUHT, Gamme, ingredients } = req.body;
  logger.info(`${req.method} ${req.originalUrl}, updating model with id ${id}`);
  
  try {
    const [results] = await database.query(QUERY.UPDATE_MODEL, [Nom, Description, PUHT, Gamme, id]);

    if (ingredients) {
      await database.query(QUERY.REMOVE_ALL_INGREDIENTS_FROM_MODEL, [id]);

      const ingredientPromises = ingredients.map(ingredient => 
        database.query(QUERY.ADD_INGREDIENT_TO_MODEL, [id, ingredient.id, ingredient.quantite])
      );

      await Promise.all(ingredientPromises);
    }

    res.status(HttpStatus.OK.code)
      .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Model with id ${id} updated`, { model: { Nom, Description, PUHT, Gamme } }));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

// Delete model by id
export const deleteModel = async (req, res) => {
  const id = req.params.id;
  logger.info(`${req.method} ${req.originalUrl}, deleting model with id ${id}`);
  try {
    // Remove all ingredients from model
    await database.query(QUERY.REMOVE_ALL_INGREDIENTS_FROM_MODEL, [id]);
    const [results] = await database.query(QUERY.DELETE_MODEL, [id]);
    res.status(HttpStatus.NO_CONTENT.code)
      .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Model with id ${id} deleted`));
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
  }
};

export default HttpStatus;