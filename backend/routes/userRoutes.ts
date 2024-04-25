import express from 'express';
const router = express.Router();
import { registerUser, loginUser, logoutUser} from '../controllers/userController';
// , getUserProfile

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
// router.get('/profile', getUserProfile);

export default router;