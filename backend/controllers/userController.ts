import { Request, Response } from 'express';
import pool from '../db';
import bcrypt from 'bcrypt';
import { Session } from 'express-session';

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
        const result = await pool.query('SELECT user_id, email, password FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password);
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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out, please try again.' });
            }
            res.json({ message: 'Logout successful' });
        });
    } else {
        res.status(200).json({ message: 'No session to log out' });
    }
};

export const getUserGroups = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    console.log('userId',userId)
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const userGroups = await pool.query(
            `SELECT group_id FROM "groups" WHERE id = $1`,
            [userId]
        );
        //SELECT g.group_id, g.name, g.created_at
        // FROM "groups"
        // JOIN "group_members" gm ON g.group_id = gm.group_id
        // WHERE gm.user_id = $1`,

        res.json(userGroups.rows);
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ error: 'An error occurred while fetching user groups' });
    }
};