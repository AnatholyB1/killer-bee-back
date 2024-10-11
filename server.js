import express from 'express';
import ip from 'ip';
import dotenv from 'dotenv';
import cors from 'cors';
import Response from './domain/response.js';
import HttpStatus from './controller/models.controller.js';
import modelRoutes from './route/models.route.js';
import logger from './util/logger.js';
import userRoutes from './route/users.route.js';
import roleRoutes from './route/roles.route.js';
import ingredientRoutes from './route/ingredients.route.js';
import procedeRoutes from './route/procede.route.js';
import etapeRouter from './route/etapes.route.js';
import authRouter from './route/auth.route.js';

dotenv.config();


// Initialisation de l'application Express
const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors({ origin: '*' ,
    exposedHeaders: ['Content-Range'],
}));
app.use(express.json());


app.use('/models', modelRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/procedes', procedeRoutes);
app.use('/etapes', etapeRouter);
app.use('/auth', authRouter);
app.get('/', (req, res) => res.send(new Response(HttpStatus.OK.code, HttpStatus.OK.status, 'Freezbe API, v1.0.0 - All Systems Go')));
app.all('*', (req, res) => res.status(HttpStatus.NOT_FOUND.code)
  .send(new Response(HttpStatus.NOT_FOUND.code, HttpStatus.NOT_FOUND.status, 'Route does not exist on the server')));
app.listen(PORT, () => logger.info(`Server running on: ${ip.address()}:${PORT}`));







/*
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

const config = {
  identityMetadata: 'https://login.microsoftonline.com/<your-tenant-id>/.well-known/openid-configuration',
  clientID: '<your-client-id>',
  responseType: 'id_token',
  responseMode: 'form_post',
  redirectUrl: 'http://localhost:3000/auth/openid/return',
  allowHttpForRedirectUrl: true,
  clientSecret: '<your-client-secret>',
  validateIssuer: false,
  passReqToCallback: false,
  scope: ['profile', 'email', 'offline_access'],
  loggingLevel: 'info',
  nonceLifetime: null,
  nonceMaxAmount: 5,
  useCookieInsteadOfSession: true,
  cookieEncryptionKeys: [
    { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
    { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
  ],
  clockSkew: null,
};

passport.use(new OIDCStrategy(config, (iss, sub, profile, accessToken, refreshToken, done) => {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }
  // Save the profile or user information in your database if needed
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
*/

/*
// Middleware d'authentification JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'Un token est requis' });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Route de login pour authentification avec Argon2
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    db.query(`SELECT * FROM Users WHERE username = '${username}'`, (error, userResult) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            const user = userResult.recordset[0];
    
            if (user && argon2.verify(user.password, password)) {
            const token = jwt.sign({ id: user.id, role: user.role }, 'votre_secret', { expiresIn: '1h' });
            res.json({ token });
            } else {
            res.status(401).json({ message: 'Identifiants incorrects' });
            }
        }
        });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fonctions de chiffrement (pas liées à Argon2)
const transposeText = (text) => text.split('').reverse().join('');
const substituteText1 = (text) =>
  text.split('').map((char) => String.fromCharCode(char.charCodeAt(0) + 3)).join('');
const substituteText2 = (text) =>
  text.split('').map((char) => char.charCodeAt(0)).join('-');

// Fonction pour chiffrer un message
const encryptMessage = (message) => {
  let encryptedMessage = transposeText(message);
  encryptedMessage = substituteText1(encryptedMessage);
  encryptedMessage = substituteText2(encryptedMessage);
  return encryptedMessage;
};

// Route pour envoyer un message chiffré
app.post('/sendMessage', (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Le message est requis' });
  }

  const encryptedMessage = encryptMessage(message);
  res.json({ encryptedMessage });
});


*/
