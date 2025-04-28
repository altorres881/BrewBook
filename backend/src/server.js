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
  



// backend/src/server.js
app.get('/beer', async (req, res) => {
    // 1) pull out limit & offset (always use paging)
    const limit  = parseInt(req.query.limit, 10)  || 50;
    const offset = parseInt(req.query.offset, 10) || 0;
  
    // 2) pull any filter params (we’ll treat param names == column names)
    const {
      index,
      brewery_id,
      brewery_name,
      review_time,
      review_overall,
      review_aroma,
      review_appearance,
      review_profilename,
      beer_style,
      review_palate,
      review_taste,
      beer_name,
      beer_abv,
      beer_id
    } = req.query;
  
    // 3) build WHERE clauses & values array
    const clauses = [];
    const values  = [];
    let   i       = 1;
  
    if (index) {
      clauses.push(`"index" = $${i}`);
      values.push(parseInt(index, 10));
      i++;
    }
    if (brewery_id) {
      clauses.push(`brewery_id = $${i}`);
      values.push(parseInt(brewery_id, 10));
      i++;
    }
    if (brewery_name) {
      clauses.push(`brewery_name ILIKE '%' || $${i} || '%'`);
      values.push(brewery_name);
      i++;
    }
    if (beer_name) {
      clauses.push(`beer_name ILIKE '%' || $${i} || '%'`);
      values.push(beer_name);
      i++;
    }
    if (beer_abv) {
      // e.g. “3+” → 3
      const n = parseFloat(beer_abv);
      clauses.push(`beer_abv >= $${i}`);
      values.push(n);
      i++;
    }
    if (beer_style) {
      clauses.push(`beer_style ILIKE '%' || $${i} || '%'`);
      values.push(beer_style);
      i++;
    }
    if (beer_id) {
      clauses.push(`beer_id = $${i}`);
      values.push(parseInt(beer_id, 10));
      i++;
    }
    if (review_time) {
      clauses.push(`review_time = $${i}`);
      values.push(parseInt(review_time, 10));
      i++;
    }
    if (review_overall) {
      clauses.push(`review_overall >= $${i}`);
      values.push(parseFloat(review_overall));
      i++;
    }
    if (review_aroma) {
      clauses.push(`review_aroma >= $${i}`);
      values.push(parseFloat(review_aroma));
      i++;
    }
    if (review_appearance) {
      clauses.push(`review_appearance >= $${i}`);
      values.push(parseFloat(review_appearance));
      i++;
    }
    if (review_palate) {
      clauses.push(`review_palate >= $${i}`);
      values.push(parseFloat(review_palate));
      i++;
    }
    if (review_taste) {
      clauses.push(`review_taste >= $${i}`);
      values.push(parseFloat(review_taste));
      i++;
    }
    if (review_profilename) {
      clauses.push(`review_profilename ILIKE '%' || $${i} || '%'`);
      values.push(review_profilename);
      i++;
    }
  
    // 4) assemble final SQL
    let sql = `SELECT * FROM group35.beer_data`;
    if (clauses.length) {
      sql += ` WHERE ` + clauses.join(' AND ');
    }
    sql += ` ORDER BY "index"`;
    // add LIMIT & OFFSET
    sql += ` LIMIT $${i} OFFSET $${i+1}`;
    values.push(limit, offset);
  
    try {
      const { rows } = await pool.query(sql, values);
      res.json(rows);
    } catch (err) {
      console.error('DB query failed:', err);
      res.status(500).send('DB query failed');
    }
  });
  
  
  // 2) Serve your static “Home.html” at /
const HOME_DIR = path.join(__dirname, '..', '..', 'frontend', 'home');
app.use('/', express.static(HOME_DIR));
app.get('/', (_req, res) => {
  res.sendFile(path.join(HOME_DIR, 'Home.html'));
});

// 3) Serve the React “filter” SPA under /filter
const SPA_DIR = path.join(__dirname, '..', '..', 'frontend', 'dist');
app.use('/filter', express.static(SPA_DIR));
app.get('/filter/*', (_req, res) => {
  res.sendFile(path.join(SPA_DIR, 'index.html'));
});





// 5) Start listening
const APP_PORT = parseInt(process.env.APP_PORT, 10) || 4000;
app.listen(APP_PORT, () => {
  console.log(` Server listening on http://localhost:${APP_PORT}`);
});
