import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

import express from 'express';
import pool from './db';
import cors from 'cors';
import router from './routes/userRoutes';

const app = express();
// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup
app.use(cors({
  origin: 'http://127.0.0.1:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}));

// Routes
app.use('/api', router);

const PORT = 3001;

// Test database connection endpoint
app.get('/testdb', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT $1::text as message', ['Database connection successful']);
    const message = result.rows[0].message;
    client.release();
    res.send(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Hello world endpoint
app.get('/hello', (req, res) => {
  res.send('Hello Worldssssssssss');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables:');
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_HOST:', process.env.DB_HOST);
  console.log('DB_NAME:', process.env.DB_NAME);
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
  console.log('DB_PORT:', process.env.DB_PORT);
  console.log('PORT:', process.env.PORT);
});
