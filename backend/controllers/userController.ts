import { Request, Response } from 'express';
import pool from '../db';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    try {
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
            [username, email, password]
        );
        res.json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if (user.rows.length > 0) {
            res.json({ message: 'Login successful', user: user.rows[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};