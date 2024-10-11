import express from 'express';
import { getIngredients, getIngredient, createIngredient, updateIngredient, deleteIngredient } from '../controller/ingredients.controller.js';

const router = express.Router();

router.route('/')
    .get(getIngredients)
    .post(createIngredient);

router.route('/:id')
    .get(getIngredient)
    .put(updateIngredient)
    .delete(deleteIngredient);


export default router;