//Requerir modulos 
import express from 'express'
import routerUser from './routers/users_routers.js'
import routerComplaint from './routers/complaints_routers.js'

//Inializaciones 
const app = express()

app.set('port', process.env.port || 3000)

//  Middleware
app.use(express.json())

//Rutas
//Ruta principal
app.get('/', (req, res)=>{
    res.send("El Servidor del GRUPO 1 está Opreando...")
})

//Rutas para los usuarios
app.use('/api', routerUser)

//Ruta para las denuncias
app.use('/api', routerComplaint)

//Exportación de la instancia app
export default app;