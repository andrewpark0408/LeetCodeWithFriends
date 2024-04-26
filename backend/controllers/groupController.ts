import pool from '../db';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

interface RequestWithUser extends Request {
    user?: { userId: string }; // or whatever type your user is
}

export const createGroup = async (req: RequestWithUser, res: Response) => {
    console.log('req.body in createGroup', req.body);
    const { name, userId } = req.body;  // Retrieve userId from the body
    console.log("Received userID:", userId);
    const code = uuidv4().slice(0, 8); // Generate a random 8-character code
    try {
        // Insert the new group and get its ID
        const newGroup = await pool.query(
            'INSERT INTO groups (name, code, creator) VALUES ($1, $2, $3) RETURNING *', // Assuming 'creator' is a column in your 'groups' table
            [name, code, userId]
        );
        const groupId = newGroup.rows[0].group_id;

        console.log("User ID when creating group:", userId);
        console.log("Group ID when creating group:", groupId);
        // Add the creator as an admin member of the group
        await pool.query(
            'INSERT INTO group_members (user_id, group_id, isAdmin) VALUES ($1, $2, true)',
            [userId, groupId]
        );

        res.json(newGroup.rows[0]);
    } catch (error: any) {
        console.error("Error in createGroup:", error);
        res.status(500).json({ error: error.message });
    }
};


export const joinGroup = async (req: RequestWithUser, res: Response) => {
    const { code } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const group = await pool.query(
            'SELECT group_id FROM groups WHERE code = $1',
            [code]
        );

        if (group.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const groupId = group.rows[0].group_id;

        const memberCheck = await pool.query(
            'SELECT * FROM GroupMembers WHERE user_id = $1 AND group_id = $2',
            [userId, groupId]
        );

        if (memberCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User already a member of this group' });
        }

        await pool.query(
            'INSERT INTO GroupMembers (user_id, group_id, isAdmin) VALUES ($1, $2, false)',
            [userId, groupId]
        );

        res.json({ message: 'Joined group successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const leaveGroup = async (req: RequestWithUser, res: Response) => {
  const { groupId } = req.params;
  const userId = req.user?.userId;  // Assuming `req.user` contains the authenticated user's data

  if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
      // Check if user is a member of the group
      const memberCheck = await pool.query(
          'SELECT * FROM group_members WHERE user_id = $1 AND group_id = $2',
          [userId, groupId]
      );

      if (memberCheck.rows.length === 0) {
          return res.status(404).json({ message: 'User is not a member of this group' });
      }

      // Remove user from the group
      await pool.query(
          'DELETE FROM group_members WHERE user_id = $1 AND group_id = $2',
          [userId, groupId]
      );

      res.json({ message: 'Left group successfully' });
  } catch (error: any) {
      res.status(500).json({ error: error.message });
  }
};

// export const addMemberToGroup = async (req: RequestWithUser, res: Response) => {
//     const { group_id, user_id, isAdmin } = req.body;

//     try {
//         const result = await pool.query(
//             'INSERT INTO GroupMembers (user_id, group_id, isAdmin) VALUES ($1, $2, $3) RETURNING *',
//             [user_id, group_id, isAdmin]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (error: any) {
//         console.error("Error adding member to group:", error);
//         res.status(500).json({ error: error.message });
//     }
// };

export const loginUser = async (req: RequestWithUser, res: Response) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query('SELECT user_id, email, password FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare the hashed password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.json({
            userId: user.rows[0].user_id,
            email: user.rows[0].email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};