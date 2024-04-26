"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple")); // Make sure to call this with (session)
// Import routers
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
// Load environment variables from .env file
dotenv_1.default.config();
// Assuming pool is exported from './db'
const db_1 = __importDefault(require("./db"));
const app = (0, express_1.default)();
// Initialize pgSession
const PgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
// Configure session middleware to use PostgreSQL for storage
app.use((0, express_session_1.default)({
    store: new PgStore({
        pool: db_1.default, // Connection pool
        tableName: 'session' // PostgreSQL table to store session data
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
app.use(express_1.default.json());
// CORS setup
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'],
}));
// Use routers for different API paths
app.use('/api/groups', groupRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
const PORT = process.env.PORT || 3001;
// Test database connection endpoint
app.get('/testdb', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = yield db_1.default.connect();
        const result = yield client.query('SELECT $1::text as message', ['Database connection successful']);
        const message = result.rows[0].message;
        client.release();
        res.send(message);
    }
    catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
}));
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
