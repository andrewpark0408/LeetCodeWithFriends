"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userController_1 = require("../controllers/userController");
// , getUserProfile
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.post('/logout', userController_1.logoutUser);
// router.get('/profile', getUserProfile);
exports.default = router;
