import {Router} from 'express';
import { allUsersController, loginUserController, oneUserController, registerUserController } from '../controllers/users_controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = Router(); 

router.post('/users/register', registerUserController); 
router.post('/users/login', loginUserController); 
router.get('/users', allUsersController); 
router.get('/users/:id', oneUserController); 

export default router