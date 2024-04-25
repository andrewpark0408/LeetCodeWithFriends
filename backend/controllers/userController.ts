import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';

export const registerUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        // Generate a salt and hash the password
        const saltRounds = 10; // Number of salt rounds for hashing the password
        console.log("Original password:", password);
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password:", hashedPassword);

        // Insert the new user with the hashed password
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email, created_at', // Exclude the password from the returning fields
            [username, email, hashedPassword]
        );

        // Respond with the newly created user info excluding the password
        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error: any) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: error.message });
    }
};


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // Query the database for the user by email
        const result = await pool.query('SELECT user_id, email, password FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];

        // Compare the hashed password with the password provided by the user
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Here you might want to create a session or generate a token depending on your authentication strategy
        res.json({
            message: 'Login successful',
            userId: user.user_id,
            email: user.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    // Here you would typically handle logout logic, such as invalidating the user's session or token
    res.json({ message: 'Logout successful' });
};