const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Configuration de connexion PostgreSQL via variables d'environnement
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  max: 10,
  idleTimeoutMillis: 30000
  connectionTimeoutMillis: 5000
});
// let i = 0;
// Tentative de connexion avec retry (utile car Postgres peut demarrer
// apres le conteneur Node malgre depends_on)
async function connectWithRetry(retries = 10, delay = 3000) {
  for (let i = 1; i <= retries; i++) {
    try {
      await pool.query('SELECT 1');
      console.log('Connexion a PostgreSQL etablie');
      return;
    } catch (err) {
      console.log(`Tentative ${i}/${retries} - PostgreSQL indisponible: ${err.message}`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  console.error('Impossible de se connecter a PostgreSQL apres plusieurs tentatives');
}

// Route racine
app.get('/', (req, res) => {
  res.json({
    message: 'Mini application DevSecOps',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Healthcheck applicatif (ne verifie pas la DB, juste que le process tourne)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Healthcheck avec verification de la base de donnees
app.get('/health/db', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'healthy', database: 'connected' });
  } catch (err) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected', error: err.message });
  }
});

// Liste des items
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, created_at FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Creation d'un item
app.post('/api/items', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le champ "name" est requis' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO items (name) VALUES ($1) RETURNING id, name, created_at',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, async () => {
  console.log(`Serveur demarre sur le port ${PORT}`);
  await connectWithRetry();
});
