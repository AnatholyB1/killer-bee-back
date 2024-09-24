const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2'); // Remplacement de bcryptjs par argon2

// Initialisation de l'application Express
const app = express();
app.use(bodyParser.json());

// Configuration SQL Server
const dbConfig = {
  user: 'your_username',
  password: 'your_password',
  server: 'your_server',
  database: 'your_database',
};

// Connexion à SQL Server
sql.connect(dbConfig)
  .then((pool) => {
    console.log('Connected to SQL Server');

    // Route pour récupérer tous les modèles
    app.get('/models', async (req, res) => {
      try {
        const result = await pool.request().query('SELECT * FROM Models');
        res.json(result.recordset);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Route pour ajouter un modèle
    app.post('/models', async (req, res) => {
      const { name, description, pUHT, gamme } = req.body;

      // Validation des champs obligatoires
      if (!name || !description || !pUHT || !gamme) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
      }

      try {
        await pool
          .request()
          .input('name', sql.VarChar, name)
          .input('description', sql.VarChar, description)
          .input('pUHT', sql.Decimal, pUHT)
          .input('gamme', sql.VarChar, gamme)
          .query('INSERT INTO Models (name, description, pUHT, gamme) VALUES (@name, @description, @pUHT, @gamme)');

        res.status(201).json({ message: 'Modèle créé avec succès' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  })
  .catch((error) => console.error('SQL Server connection error:', error));

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
    const userResult = await sql.query(`SELECT * FROM Users WHERE username = '${username}'`);
    const user = userResult.recordset[0];

    if (user && await argon2.verify(user.password, password)) { // Vérification du mot de passe avec Argon2
      const token = jwt.sign({ id: user.id, role: user.role }, 'votre_secret', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Identifiants incorrects' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route protégée pour récupérer les modèles (authentification requise)
app.get('/models', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès interdit' });
  }

  try {
    const result = await sql.query('SELECT * FROM Models');
    res.json(result.recordset);
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

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
