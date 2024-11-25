import {Router} from 'express';
import { allUsersController, deleteUserController, loginUserController, oneUserController, registerUserController } from '../controllers/users_controller.js';
import { verifyToken } from '../middlewares/auth.js';
import { updateComplaintController } from '../controllers/complaints_controller.js';
const router = Router(); 

router.post('/users/register', registerUserController); 
router.post('/users/login', loginUserController); 
router.get('/users', verifyToken, allUsersController); 
router.get('/users/:id', verifyToken, oneUserController); 
router.get('/users/:id', verifyToken, updateComplaintController);
router.get('/users/:id', verifyToken, deleteUserController); 

export default router