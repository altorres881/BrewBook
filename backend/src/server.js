// Load .env and prompt for any missing secrets
require('dotenv').config();
const express = require('express');
const prompt  = require('prompt-sync')({ sigint: true });
const { Pool } = require('pg');
const path = require('path');

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

  //Sets the search_path to our group (then looks at public if specificed table isnt found)
  options: '-c search_path=group35,public'
});

const app = express();

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:5173' }));

// const FRONTEND_DIR = path.join(__dirname, '..', '..', 'frontend');

// app.use(express.static(FRONTEND_DIR));

// root page
app.get('/', (_req, res) => {
    console.log('Backend Accessed');
  });
  

// 4) Your real data route
app.get('/airports', async (req, res) => {
    const limit  = parseInt(req.query.limit, 10)  || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
  
    try {
      const { rows } = await pool.query(
        `SELECT * 
           FROM airports 
          LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      res.json(rows);
    } catch (err) {
      console.error('DB error:', err);
      res.status(500).send('DB query failed');
    }
  });

app.get('/beer', async (req, res) =>{
    const limit  = parseInt(req.query.limit, 10)  || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
  
    try {
      const { rows } = await pool.query(
        `SELECT * 
           FROM beer_data 
          LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
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
