//Importe Librerias
import cloudinary from 'cloudinary';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import express from 'express'

//Requerir Rutas
import routerUser from './routers/users_routers.js'
import routerComplaint from './routers/complaints_routers.js'

//Inializaciones 
const app = express()

app.set('port', process.env.port || 3000);

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.cloud_api_key, 
    api_secret: process.env.cloud_api_secret
});

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}));

//  Middleware
app.use(express.json());

//RUTAS
//Ruta principal
app.get('/', (req, res)=>{
    res.send("El Servidor del GRUPO 1 está Opreando...")
});

//Rutas para los usuarios
app.use('/api', routerUser);

//Ruta para las denuncias
app.use('/api', routerComplaint);

//Exportación de la instancia app
export default app;