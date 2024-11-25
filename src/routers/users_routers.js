import {Router} from 'express';
import { loginUserController, registerUserController } from '../controllers/users_controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = Router(); 

router.post('/users/register', registerUserController); 
router.post('/users/login', loginUserController)

export default router