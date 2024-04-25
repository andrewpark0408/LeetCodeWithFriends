import express from 'express';
const gRouter = express.Router();
import { createGroup, joinGroup, leaveGroup} from '../controllers/groupController';


gRouter.post('/createGroup', createGroup);
gRouter.post('/joingroup', joinGroup);
gRouter.delete('/leavegroup/:groupId', leaveGroup);
export default gRouter;