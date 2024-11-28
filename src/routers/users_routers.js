import {Router} from 'express';
import { updateUserController, allUsersController, deleteUserController, loginUserController, oneUserController, registerUserController } from '../controllers/users_controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = Router(); 

//Rutas públicas: usuarios
router.post('/users/register', registerUserController); 
router.post('/users/login', loginUserController); 

//Rutas privadas: usuarios
router.get('/users', verifyToken, allUsersController); 
router.get('/users/:id', verifyToken, oneUserController); 
router.patch('/users/:id', verifyToken, updateUserController);
router.delete('/users/:id', verifyToken, deleteUserController); 

export default router