import { v4 as uuidv4 }  from 'uuid'
import bcrypt from "bcrypt"
import userModel from '../models/users.js';
import { createToken } from '../middlewares/auth.js';
const saltRounds = 10
const registerUserController = async(req, res)=> {
    
    const { password, email, username, rol, ...otherData } = req.body;

	var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

	if (!password || !email || !username || !rol || password.trim() === "" || email.trim() === "" || username.trim() === "" || rol.trim() === "" ) {
        return res.status(422).json({error: "Datos vacíos, llénelos por favor" });
    }

    if( !validEmail.test(email)){
		res.status(422).json({error: "Email no valido "});
	}

    if (password.length < 6){
        res.status(422).json({error: "Contraseña con digitos menores a 6, deben ser mayores a este número"});
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
            id: uuidv4(),
            password: hashedPassword,
            email, 
            username, 
            rol, 
            ...otherData
    }
    try {
        const user = await userModel.registerUserModel(userData);
        if (user.error){
            return res.status(401).json({error: user.error})
        }       
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error.msg);
    }
}

const loginUserController = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await userModel.loginUserModel(username, password);
        if (user.error) {
            return res.status(404).json({ error: user.error });
        }
        delete user.password;
        const token = createToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json(error);
    }
};

const allUsersController = async (req, res) => {
    const {rol} = req.body;
    if (rol == "administrador" || rol == "admin"){
        try {
            const allUsers = await userModel.getUsers();
            res.status(200).json(allUsers);
        } catch (error) {
            res.status(500).json({message:error});
        }
    } else{
        res.status(401).json({error: "Mostrar a todos los usuarios solo se encuentra permitido para el administrador"});
    }
}

const oneUserController = async (req, res) => {
    const {id} = req.params;
    const {rol} = req.body;
    if(rol == "administrador" || rol == "admin"){
        try{
            const oneUser = await userModel.findUser(id);
            if (oneUser.error){
                return res.status(404).json({error: oneUser.error});
            }
            res.status(200).json(oneUser);
        } catch (error)
        {
            res.status(500).json({message:error});
        }
    } else{
        res.status(401).json({error: "Mostrar a un usuario en especifico solo se encuentra permitido para el administrador"});
    }
}

const updateUserController = async (req,res) => {
    const {id} = req.params
    const {password, ...otherData} = req.body
    if(password){
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        otherData.password = hashedPassword
    }
    const orderData={
        id,
        ...otherData
    }
    
    try {
        const updateUser = await userModel.updateUser(id, orderData)
        res.status(200).json(updateUser)
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const deleteUserController = async (req,res) => {
    const {id} = req.params
    const {rol} = req.body;
    if(rol == "administrador" || rol == "admin"){
        try {
            const deleteUser = await userModel.deleteUser(id);
            res.status(200).json({message:'Se ha eliminado correctamente el usuario'})
        } catch (error) {
            res.status(500).json({message:error})
        }
    }else{
        res.status(401).json({error:"Eliminar a un usuario solo se encuentra permitido para el administrador"})
    }
}

export{
    registerUserController,
    loginUserController, 
    allUsersController, 
    oneUserController, 
    updateUserController, 
    deleteUserController
}