import express from 'express';
const router = express.Router();
import { registerUser, loginUser, logoutUser, getUserGroups} from '../controllers/userController';
// , getUserProfile

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/userGroups/:userId', getUserGroups);
// router.get('/profile', getUserProfile);

export default router;