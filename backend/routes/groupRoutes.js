"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gRouter = express_1.default.Router();
const groupController_1 = require("../controllers/groupController");
gRouter.post('/createGroup', groupController_1.createGroup);
gRouter.post('/joingroup', groupController_1.joinGroup);
gRouter.delete('/leavegroup/:groupId', groupController_1.leaveGroup);
exports.default = gRouter;
