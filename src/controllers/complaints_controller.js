//Importación de librerias
import {v2 as cloudinary} from 'cloudinary';
import {promises as fs} from 'fs';
import { v4 as uuidv4 } from 'uuid';

//Importación de modelos
import complainModel from '../models/complaints.js';


const registerComplaintController = async (req, res) =>{
    //Desestructuración
    const {barrio, username, hora, tipo, perdida_pertenencias, danios, ...otherData } = req.body;
    //Validación de los campos
    const areFieldsEmpty = (...fields) => fields.some(field => !field || field.trim() === "");
    //Verificación de campos llenos
    if (
        areFieldsEmpty(barrio, username, hora, tipo, perdida_pertenencias, danios) || 
        !req.files || !req.files.imagen
    ) {
        return res.status(400).json({ error: "Datos vacíos o falta el archivo de imagen, llénelos por favor" });
    }

    try {
        //Carga de imagenes en Regsitro
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:"Denuncias"});
        const imagen = cloudinaryResponse.secure_url;
        const public_id = cloudinaryResponse.public_id;

        //Construcción del objeto
        const complaintData = {
            id: uuidv4(),
            barrio, 
            username, 
            hora,
            tipo,
            perdida_pertenencias,
            imagen,
            public_id, 
            ...otherData
        };

        //Registro de la información
        const complaint = await complainModel.registerComplaint(complaintData);
        const {id} = complaint;
        res.status(200).json({message:"Denuncia registrada con éxito.", id});
        
        //Vaciar la carpeta de carga temporal
        await fs.unlink(req.files.imagen.tempFilePath);

    } catch (error) {
        console.log(error)
        res.status(500).json(error.message);
    }
}

const getComplaintController = async (req,res) => {
    //Obtener la información de todos los registros
    try {
        const complaints = await complainModel.getComplaint()
        res.status(200).json(complaints)
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const findComplaintController = async (req,res) => {
    //Desestructuración y obtención de ID
    const {id} = req.params;
    //Busuqeda de un registro previo
    try {
        const complaint = await complainModel.findComplaint(id)
        if (complaint.error) {
            return res.status(404).json({error: complaint.error})
        }
        res.status(200).json(complaint)
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const updateComplaintController = async (req,res) => {
    
    const { id } = req.params; // ID del registro a actualizar
    const updates = req.body; // Datos a actualizar

    try {
        // Buscar el registro original
        const complaint = await complainModel.findComplaint(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Registro no encontrado' });
        }

        // Obtener los atributos válidos del modelo
        const validFields =  ['barrio', 'username', 'hora', 'tipo', 'perdida_pertenencias', 'daños', 'imagen'];
        const filteredUpdates = {};
        

        // Filtrar los campos válidos para la actualización
        for (const key in updates) {
            
            if (validFields.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
        }

        // Manejar la subida de la imagen (si se proporciona)
        if (req.files && req.files.imagen) {
            const cloudinaryResponse = await cloudinary.uploader.upload(
                req.files.imagen.tempFilePath,
                { folder: "Denuncias" }
            );
            filteredUpdates['imagen'] = cloudinaryResponse.secure_url;
            filteredUpdates['public_id'] = cloudinaryResponse.public_id;
        }

        // Validar si hay campos para actualizar
        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos válidos para actualizar' });
        }

        // Realizar la actualización
        const complaintUp=await complainModel.updateComplaint(id,filteredUpdates)

        // Responder con el registro actualizado
        return res.status(200).json({ message: 'Registro actualizado correctamente', data: complaintUp });
    } catch (error) {
        // Manejo de errores
        console.error(error);
        return res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }

}

const updateComplaintTotallyController = async (req,res) => {
    //Desestructuración y obtención del ID
    const {id} = req.params

    //Desestructuración
    const {barrio, username, hora, tipo, perdida_pertenencias, danios, ...otherData } = req.body;
    //Validación de los campos
    const areFieldsEmpty = (...fields) => fields.some(field => !field || field.trim() === "");
    //Verificación de campos llenos
    if (
        areFieldsEmpty(barrio, username, hora, tipo, perdida_pertenencias, danios) || 
        !req.files || !req.files.imagen
    ) {
        return res.status(400).json({ error: "Datos vacíos o falta el archivo de imagen, llénelos por favor" });
    }

    try {
        //Destrucción de la imagen previa
        const complaintFind = await complainModel.findComplaint(id);
        await cloudinary.uploader.destroy(complaintFind.public_id);
        //Carga de la nueva imagen
        const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:"Denuncias"});
        const imagen = cloudinaryResponse.secure_url;
        const public_id = cloudinaryResponse.public_id;

        //Construcción del objeto actualizado
        const orderData={
            id,
            ...req.body,
            imagen,
            public_id
        }

        //Actualización del registro
        const complaint = await complainModel.updateComplaintTotally(id, orderData)
        return res.status(200).json({ message: 'Registro actualizado correctamente', data: complaint });
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const deleteComplaintController = async (req,res) => {
    //Desestructuración y obtención del ID
    const {id} = req.params
    try {
        //Busqueda de la imagen en la nube
        const complaintFind = await complainModel.findComplaint(id);
        //Destrucción de la imagen
        await cloudinary.uploader.destroy(complaintFind.public_id);
        //Eliminación de registro
        await complainModel.deleteComplaint(id);
        res.status(200).json({message:'Denuncia eliminada correctamente'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}

//exportamos
export {
    registerComplaintController,
    getComplaintController,
    findComplaintController,
    updateComplaintController,
    updateComplaintTotallyController,
    deleteComplaintController
}