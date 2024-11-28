import dotenv from 'dotenv'

dotenv.config()

//Modelo para denuncias
const complainModel = {
    async registerComplaint(newComplain){
        const url = process.env.DB_COMPLAINTS;
        const peticion = await fetch(url, {
            method:'POST',
            body:JSON.stringify(newComplain),
            headers:{'Content-Type':'applicatio/json'}
        })

        console.log(peticion);
        const data = await peticion.json();

        return data;
    },

    async getComplaint(){
        try {
            const url = process.env.DB_COMPLAINTS;
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async findComplaint(idComplaint){
        try {
            const url = `${process.env.DB_COMPLAINTS}${idComplaint}`
            const peticion = await fetch(url);
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
            return {error: "No se encontró la denuncia"}
        }
    },

    async updateComplaint(idComplaint, updatedComplaint){
        try {
            const url = `${process.env.DB_COMPLAINTS}${idComplaint}`
            const peticion = await fetch(url,{
                method:'PATCH',
                body:JSON.stringify(updatedComplaint),
                headers:{'Content-Type':'application/json'},
            });
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async updateComplaintTotally(idComplaint, updatedComplaint){
        try {
            const url = `${process.env.DB_COMPLAINTS}${idComplaint}`
            const peticion = await fetch(url,{
                method:'PUT',
                body:JSON.stringify(updatedComplaint),
                headers:{'Content-Type':'application/json'},
            });
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    },

    async deleteComplaint(idComplaint){
        try {
            const url = `${process.env.DB_COMPLAINTS}${idComplaint}`
            const peticion = await fetch(url,{
                method:'DELETE'
            });
            const data = await peticion.json();
            return data;
        } catch (error) {
            console.error(error)
        }
    }
};

export default complainModel;