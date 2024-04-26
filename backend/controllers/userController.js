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
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const db_1 = __importDefault(require("../db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    try {
        // Generate a salt and hash the password
        const saltRounds = 10; // Number of salt rounds for hashing the password
        console.log("Original password:", password);
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        console.log("Hashed password:", hashedPassword);
        // Insert the new user with the hashed password
        const newUser = yield db_1.default.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at', // Exclude the password from the returning fields
        [username, email, hashedPassword]);
        // Respond with the newly created user info excluding the password
        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const result = yield db_1.default.query('SELECT user_id, email, password FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = result.rows[0];
        const isValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // Store user ID in session
        req.session.userId = user.user_id;
        res.json({
            message: 'Login successful',
            userId: user.user_id,
            email: user.email
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out, please try again.' });
            }
            res.json({ message: 'Logout successful' });
        });
    }
    else {
        res.status(200).json({ message: 'No session to log out' });
    }
});
exports.logoutUser = logoutUser;
