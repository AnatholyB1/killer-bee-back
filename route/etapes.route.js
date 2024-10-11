import express from 'express';
import { getEtapes, getEtape, createEtape, updateEtape, deleteEtape } from '../controller/etapes.controller.js';

const router = express.Router();

router.route('/')
    .get(getEtapes)
    .post(createEtape);

router.route('/:id')
    .get(getEtape)
    .put(updateEtape)
    .delete(deleteEtape);

export default router;