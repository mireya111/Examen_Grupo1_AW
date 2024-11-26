import { Router } from "express";
import { deleteComplaintController, findComplaintController, getComplaintController, registerComplaintController, updateComplaintController, updateComplaintTotallyController } from "../controllers/complaints_controller.js";
import { verifyToken } from "../middlewares/auth.js";
const router = Router();
//Rutas privadas: denuncias
router.post('/complaints/register', verifyToken, registerComplaintController);
router.get('/complaints',verifyToken,getComplaintController)
router.get('/complaints/:id',verifyToken,findComplaintController)
router.patch('/complaints/:id',verifyToken,updateComplaintController)
router.put('/complaints/:id',verifyToken,updateComplaintTotallyController)
router.delete('/complaints/:id',verifyToken,deleteComplaintController)


export default router;