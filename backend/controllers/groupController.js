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
exports.loginUser = exports.leaveGroup = exports.joinGroup = exports.createGroup = void 0;
const db_1 = __importDefault(require("../db"));
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const createGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('req.body in createGroup', req.body);
    const { name, userId } = req.body; // Retrieve userId from the body
    console.log("Received userID:", userId);
    const code = (0, uuid_1.v4)().slice(0, 8); // Generate a random 8-character code
    try {
        // Insert the new group and get its ID
        const newGroup = yield db_1.default.query('INSERT INTO groups (name, code, creator) VALUES ($1, $2, $3) RETURNING *', // Assuming 'creator' is a column in your 'groups' table
        [name, code, userId]);
        const groupId = newGroup.rows[0].group_id;
        console.log("User ID when creating group:", userId);
        console.log("Group ID when creating group:", groupId);
        // Add the creator as an admin member of the group
        yield db_1.default.query('INSERT INTO group_members (user_id, group_id, isAdmin) VALUES ($1, $2, true)', [userId, groupId]);
        res.json(newGroup.rows[0]);
    }
    catch (error) {
        console.error("Error in createGroup:", error);
        res.status(500).json({ error: error.message });
    }
});
exports.createGroup = createGroup;
const joinGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { code } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        const group = yield db_1.default.query('SELECT group_id FROM groups WHERE code = $1', [code]);
        if (group.rows.length === 0) {
            return res.status(404).json({ message: 'Group not found' });
        }
        const groupId = group.rows[0].group_id;
        const memberCheck = yield db_1.default.query('SELECT * FROM GroupMembers WHERE user_id = $1 AND group_id = $2', [userId, groupId]);
        if (memberCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User already a member of this group' });
        }
        yield db_1.default.query('INSERT INTO GroupMembers (user_id, group_id, isAdmin) VALUES ($1, $2, false)', [userId, groupId]);
        res.json({ message: 'Joined group successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.joinGroup = joinGroup;
const leaveGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { groupId } = req.params;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId; // Assuming `req.user` contains the authenticated user's data
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    try {
        // Check if user is a member of the group
        const memberCheck = yield db_1.default.query('SELECT * FROM GroupMembers WHERE user_id = $1 AND group_id = $2', [userId, groupId]);
        if (memberCheck.rows.length === 0) {
            return res.status(404).json({ message: 'User is not a member of this group' });
        }
        // Remove user from the group
        yield db_1.default.query('DELETE FROM GroupMembers WHERE user_id = $1 AND group_id = $2', [userId, groupId]);
        res.json({ message: 'Left group successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.leaveGroup = leaveGroup;
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
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield db_1.default.query('SELECT user_id, email, password FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        // Compare the hashed password
        const validPassword = yield bcrypt_1.default.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.json({
            userId: user.rows[0].user_id,
            email: user.rows[0].email
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An error occurred during login' });
    }
});
exports.loginUser = loginUser;
