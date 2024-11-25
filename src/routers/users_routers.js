import {Router} from 'express';
import { updateUserController, allUsersController, deleteUserController, loginUserController, oneUserController, registerUserController } from '../controllers/users_controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = Router(); 

router.post('/users/register', registerUserController); 
router.post('/users/login', loginUserController); 
router.get('/users', verifyToken, allUsersController); 
router.get('/users/:id', verifyToken, oneUserController); 
router.put('/users/:id', updateUserController);
router.delete('/users/:id', verifyToken, deleteUserController); 

export default router