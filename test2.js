const express = require('express');
const { Pool } = require('pg');

const app = express();
const pool = new Pool();

app.use(express.json());

app.post('/items', async (req, res) => {
  // Direct Source (req.body.name) -> Direct Sink (pool.query)
  const result = await pool.query(
    "INSERT INTO items (name) VALUES ('" + req.body.name + "') RETURNING id, name, created_at"
  );
  res.json(result.rows[0]);
});