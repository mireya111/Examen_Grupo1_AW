import { v4 as uuidv4 }  from 'uuid'
import bcrypt from "bcrypt"
import userModel from '../models/users.js';
import { createToken } from '../middlewares/auth.js';
const saltRounds = 10
const registerUserController = async(req, res)=> {
    
    const { password, ...otherDataUser } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userData = {
        id: uuidv4(),
        password: hashedPassword,
        ...otherDataUser
    }
    
    try {
        const user = await userModel.registerUserModel(userData)
        console.log(user);
        
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error.msg)
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

export{
    registerUserController,
    loginUserController, 
    allUsersController, 
    oneUserController
}