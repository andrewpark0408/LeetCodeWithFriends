import express from 'express';
const router = express.Router();
import { registerUser, loginUser} from '../controllers/userController';
// , getUserProfile

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.get('/profile', getUserProfile);

export default router;