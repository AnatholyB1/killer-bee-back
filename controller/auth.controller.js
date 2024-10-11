import database from '../config/mysql.config.js';
import Response from '../domain/response.js';
import logger from '../util/logger.js';
import QUERY from '../query/users.query.js';

const HttpStatus = {
    OK: { code: 200, status: 'OK' },
    CREATED: { code: 201, status: 'CREATED' },
    NO_CONTENT: { code: 204, status: 'NO_CONTENT' },
    BAD_REQUEST: { code: 400, status: 'BAD_REQUEST' },
    NOT_FOUND: { code: 404, status: 'NOT_FOUND' },
    INTERNAL_SERVER_ERROR: { code: 500, status: 'INTERNAL_SERVER_ERROR' }
  };


//login
export const login = async (req, res) => {
    const { Email, Password } = req.body;
    logger.info(`${req.method} ${req.originalUrl}, logging in user with email ${Email}`);
    try {
        const [results] = await database.query(QUERY.GET_USER_BY_EMAIL, [Email]);
        if (!results.length) {
            return res.status(HttpStatus.NOT_FOUND.code)
                .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, `User with email ${Email} not found`));
        }
        const user = results[0];
        if (user.Password !== Password) {
            return res.status(HttpStatus.BAD_REQUEST.code)
                .send(new Response(HttpStatus.BAD_REQUEST.code, HttpStatus.BAD_REQUEST.status, 'Invalid password'));
        }
        res.status(HttpStatus.OK.code)
            .send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'User logged in', { user }));
    } catch (error) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code, HttpStatus.INTERNAL_SERVER_ERROR.status, error.message));
    }
}
