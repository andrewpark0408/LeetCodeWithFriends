import express from 'express';
import session from 'express-session';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import pgSession from 'connect-pg-simple'; // Make sure to call this with (session)

// Import routers
import router from './routes/userRoutes';
import gRouter from './routes/groupRoutes';

// Load environment variables from .env file
dotenv.config();

// Assuming pool is exported from './db'
import pool from './db';

const app = express();

// Initialize pgSession
const PgStore = pgSession(session);

// Configure session middleware to use PostgreSQL for storage
app.use(session({
    store: new PgStore({
        pool: pool,                    // Connection pool
        tableName: 'session'           // PostgreSQL table to store session data
    }),
    secret: process.env.SESSION_SECRET || 'secret', // Secret key for signing the session ID cookie
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Session cookie expires in 30 days
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true
    }
}));

// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}));

// Use routers for different API paths
app.use('/api/groups', gRouter);
app.use('/api/users', router);

const PORT = process.env.PORT || 3001;

// Test database connection endpoint
app.get('/testdb', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT $1::text as message', ['Database connection successful']);
        const message = result.rows[0].message;
        client.release();
        res.send(message);
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Hello world endpoint
app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Environment variables:');
    console.log('DB_USER:', process.env.DB_USER);
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    console.log('DB_PORT:', process.env.DB_PORT);
    console.log('PORT:', PORT);
});
