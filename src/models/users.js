import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

//Modelo usuarios
const userModel = {

    async registerUserModel (newUser) {
        const url = process.env.DB_USERS
        const response = await fetch(url)
        const users = await response.json()

        const user = users.find(user => user.username === newUser.username || user.email === newUser.email)
  

        if(!user){
            const peticion = await fetch(url,{
                method:'POST',
                body:JSON.stringify(newUser),
                headers:{'Content-Type':'application/json'}
            })
            console.log(peticion);
            const data = await peticion.json()
            return data
        }else{
           return {error: "Usuario o email ya existentes"}
        }
    },

    async loginUserModel (username, password){
        const url = process.env.DB_USERS
        const response = await fetch(url)
        const users = await response.json()

        const user = users.find(user => user.username === username)
        
        if (!user){
            return {error: "Usuario o contraseña incorrectos"}
        } else if (user == null || password == null){
            return {error: "Usuario o contraseña vacíos"}
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (user && passwordMatch){
            return user
        }else{
            return {error: "Usuario o contraseña incorrectos"}
        }

    }, 

    async getUsers(){
        try {
            const url = process.env.DB_USERS;
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async findUser(idUser){
        try {
            const url = `${process.env.DB_USERS}${idUser}`
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
            return {error: "No se encontró el usuario"}
        }
    },

    async updateUser(idUser, updatedUser){
        try {
            const url = `${process.env.DB_USERS}${idUser}`
            const peticion = await fetch(url,{
                method:'PATCH',
                body:JSON.stringify(updatedUser),
                headers:{'Content-Type':'application/json'},
            });
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async deleteUser(idUser){
        try {
            const url = `${process.env.DB_USERS}${idUser}`
            const peticion = await fetch(url,{
                method:'DELETE'
            });
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    }
}

export default userModel