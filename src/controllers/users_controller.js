import { v4 as uuidv4 }  from 'uuid'
import bcrypt from "bcrypt"
import userModel from '../models/users.js';
import { createToken } from '../middlewares/auth.js';
const saltRounds = 10
const registerUserController = async(req, res)=> {
    
    const { password, email, username, ...otherData } = req.body;

	var validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

	if (!password || !email || !username || password.trim() === "" || email.trim() === "" || username.trim() === "") {
        return res.status(400).json({error: "Datos vacíos, llénelos por favor" });
    }
    if( !validEmail.test(email)){
		res.status(500).json({error: "Email no valido "});
	}

    if (password.length < 6){
        res.status(500).json({error: "Contraseña con digitos menores a 6, deben ser mayores a este número"});
    }
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
            id: uuidv4(),
            password: hashedPassword,
            email, 
            username, 
            ...otherData
    }
    try {
        const user = await userModel.registerUserModel(userData);
        console.log(user);
            
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
            return res.status(401).json({ error: user.error });
        }
        delete user.password;
        const token = createToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json(error);
    }
};

const allUsersController = async (req, res) => {
    try {
        const allUsers = await userModel.getUsers();
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({message:error});
    }
}

const oneUserController = async (req, res) => {
    const {id} = req.params;
    try{
        const oneUser = await userModel.findUser(id);
        res.status(200).json(oneUser);
    } catch (error)
    {
        res.status(500).json({message:error});
    }
}

const updateUserController = async (req,res) => {
    const {id} = req.params

    const orderData={
        id,
        ...req.body
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

    try {
        const deleteUser = await userModel.deleteUser(id);
        res.status(200).json({message:'Se ha eliminado correctamente el usuario'})
    } catch (error) {
        res.status(500).json({message:error})
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