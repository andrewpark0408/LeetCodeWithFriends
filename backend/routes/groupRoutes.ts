import express from 'express';
const gRouter = express.Router();
import { createGroup, joinGroup, leaveGroup, addMemberToGroup } from '../controllers/groupController';


gRouter.post('/createGroup', createGroup);
gRouter.post('/joingroup', joinGroup);
gRouter.delete('/leavegroup/:groupId', leaveGroup);
gRouter.post('/addMember', addMemberToGroup);
export default gRouter;