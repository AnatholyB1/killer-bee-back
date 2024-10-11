import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/roles.query.js';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
};

// Get all roles
export const getRoles = async (req, res) => {
    logger.info(`${req.method} ${req.originalUrl}, fetching roles`);
    try {
        const [results] = await database.query(QUERY.LIST_ROLES);
        if (!results.length) {
            res.setHeader('Content-Range', 'roles 0-0/0');
            return res.status(HttpStatus.OK.code)
                .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'No roles found', []));
        }
        res.setHeader('Content-Range', `roles 0-${results.length - 1}/${results.length}`);
        res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Roles retrieved', results));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
};

// Get role by id
export const getRole = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, fetching role with id ${id}`);
    try {
        const [results] = await database.query(QUERY.GET_ROLE, [id]);
        if (!results.length) {
            return res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `Role with id ${id} not found`));
        }
        res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, `Role with id ${id} retrieved`, { role: results[0] }));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
};

// Create role
export const createRole = async (req, res) => {
    const { NomRole } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, creating role with name ${NomRole}`);
    try {
        const [results] = await database.query(QUERY.CREATE_ROLE, [NomRole]);
        res.status(HttpStatus.CREATED.code)
            .send(new Response(HttpStatus.CREATED.code, HttpStatus.CREATED.status, `Role with name ${NomRole} created`, { role: { NomRole } }));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
};

// Update role by id
export const updateRole = async (req, res) => {
    const id = req.params.id;
    const { NomRole } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, updating role with id ${id}`);
    try {
        const [results] = await database.query(QUERY.UPDATE_ROLE, [NomRole, id]);
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Role with id ${id} updated`));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
};

// Delete role by id
export const deleteRole = async (req, res) => {
    const id = req.params.id;
    logger.info(`${req.method} ${req.originalUrl}, deleting role with id ${id}`);
    try {
        const [results] = await database.query(QUERY.DELETE_ROLE, [id]);
        res.status(HttpStatus.NO_CONTENT.code)
            .send(new Response(HttpStatus.NO_CONTENT.code, HttpStatus.NO_CONTENT.status, `Role with id ${id} deleted`));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
};