import express from 'express';
import { getModels, createModel, getModel, deleteModel, updateModel } from '../controller/models.controller.js';

const modelRoutes = express.Router();

modelRoutes.route('/')
  .get(getModels)
  .post(createModel);

modelRoutes.route('/:id')
  .get(getModel)
  .put(updateModel)
  .delete(deleteModel);

export default modelRoutes;