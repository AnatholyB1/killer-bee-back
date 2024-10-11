import express from 'express';
import { getProcedes, getProcede, createProcede, updateProcede, deleteProcede } from '../controller/procede.controller.js';

const router = express.Router();
router.route('/')
    .get(getProcedes)
    .post(createProcede);

router.route('/:id')
    .get(getProcede)
    .put(updateProcede)
    .delete(deleteProcede);

export default router;