import express from 'express';
import { getRoles, createRole, getRole, deleteRole, updateRole } from '../controller/roles.controller.js';


const roleRoutes = express.Router();

roleRoutes.route('/')
    .get(getRoles)
    .post(createRole);

roleRoutes.route('/:id')
    .get(getRole)
    .put(updateRole)
    .delete(deleteRole);

export default roleRoutes;