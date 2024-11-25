import bcrypt from 'bcrypt'
//Modelo usuarios
const userModel = {

    async registerUserModel (newUser) {
        const url = "http://localhost:4000/users"
        const peticion = await fetch(url,{
            method:'POST',
            body:JSON.stringify(newUser),
            headers:{'Content-Type':'application/json'}
        })

        console.log(peticion);
        const data = await peticion.json()
        
        return data
    },

    async loginUserModel (username, password){
        const url = "http://localhost:4000/users"
        const response = await fetch(url)
        const users = await response.json()

        const user = users.find(user => user.username === username)
        if (!user){
            return {error: "Usuario o contraseña incorrectos"}
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
            const url = "http://localhost:4000/users";
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async findUser(idUser){
        try {
            const url = `http://localhost:4000/users/${idUser}`
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },


}

export default userModel