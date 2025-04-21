require('dotenv').config();
const fs      = require('fs');
const { Client } = require('ssh2');
const prompt  = require('prompt-sync')({ sigint: true });
const { Pool } = require('pg');
const express  = require('express');

// if you didn’t set SSH_PASSWORD in .env, ask for it now:
const sshPassword = process.env.SSH_PASSWORD
  || prompt.hide('SSH password: ');

const sshConfig = {
  host:       process.env.SSH_HOST,
  port:       parseInt(process.env.SSH_PORT, 10) || 22,
  username:   process.env.SSH_USER,
  privateKey: process.env.SSH_KEY_PATH
                 ? fs.readFileSync(process.env.SSH_KEY_PATH)
                 : undefined,
  password:   sshPassword
};

const dbConfig = {
  host:     '127.0.0.1',  // we’ll forward to localhost
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const sshClient = new Client();

sshClient.on('ready', () => {
  console.log('  SSH connection ready, setting up tunnel...');
  // forward local 5432 --> remote DB_HOST:DB_PORT
  sshClient.forwardOut(
    '127.0.0.1', 0,
    process.env.DB_HOST, dbConfig.port,
    (err, stream) => {
      if (err) {
        console.error('Tunnel error:', err);
        process.exit(1);
      }
      console.log('  Tunnel established');

      // attach the forwarded stream to pg
      const pool = new Pool({
        ...dbConfig,
        stream
      });

      const app = express();
      app.use(express.json());

      app.get('/', async (_req, res) => {
        res.send("omw to da liqo sto")
      });

      // …add your other CRUD routes here…

      const port = parseInt(process.env.APP_PORT, 10) || 4000;
      app.listen(port, () => {
        console.log(`🍺 API up on http://localhost:${port}`);
      });
    }
  );
});

sshClient.on('error', err => {
  console.error('SSH connection error:', err);
});

sshClient.connect(sshConfig);