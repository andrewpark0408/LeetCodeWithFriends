import express from 'express';
import pool from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/testdb', async (req, res) => {
  try {
    res.send('Testing database connection');
  } catch (err: any) {
    res.status(500).json({ error: err });
  }
});

app.get('/hello', (req, res) => {
  res.send('Hello Worldssssssssss');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
