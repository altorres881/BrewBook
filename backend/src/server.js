// Load .env and prompt for any missing secrets
require('dotenv').config();
const express = require('express');
const prompt  = require('prompt-sync')({ sigint: true });
const { Pool } = require('pg');

const DB_HOST     = process.env.DB_HOST     || 'ada.mines.edu';
const DB_PORT     = parseInt(process.env.DB_PORT, 10) || 5432;
const DB_USER     = process.env.DB_USER     || prompt('DB user: ');
const DB_PASSWORD = process.env.DB_PASSWORD || prompt.hide('DB password: ');
const DB_NAME     = process.env.DB_NAME     || 'csci403';

// Set up the Postgres pool
const pool = new Pool({
  host:     DB_HOST,
  port:     DB_PORT,
  user:     DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

const app = express();
app.use(express.json());

// root page
app.get('/', (_req, res) => {
  res.send('omw to da liqo sto');
});

// 4) Your real data route
app.get('/airports', async (_req, res) => {
  console.log('  GET /airports');
  try {
    // If your table lives in another schema, you can do:
    // const { rows } = await pool.query('SELECT * FROM your_schema.airports;');
    const { rows } = await pool.query('SELECT * FROM airports;');
    res.json(rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).send('DB query failed');
  }
});

// 5) Start listening
const APP_PORT = parseInt(process.env.APP_PORT, 10) || 4000;
app.listen(APP_PORT, () => {
  console.log(` Server listening on http://localhost:${APP_PORT}`);
});
