import { v4 as uuidv4 } from 'uuid'
import complainModel from '../models/complaints.js';

const registerComplaintController = async (req, res) =>{


    const {...otherData} = req.body;
    const complaintData = {
        id: uuidv4(),
        ...otherData
    };

    try {
        const complaint = await complainModel.registerComplaint(complaintData);
        const {id} = complaint;
        res.status(200).json({message:"Denuncia registrada con éxito.", id});
        
    } catch (error) {
        res.status(500).json(error.msg);
    }
}

const getComplaintController = async (req,res) => {
    
    try {
        const complaints = await complainModel.getComplaint()
        res.status(200).json(complaints)
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const findComplaintController = async (req,res) => {
    
    const {id} = req.params;

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
    
    const {id} = req.params;

    try {
        const complaint=await complainModel.updateComplaint(id,req.body)
        res.status(200).json(complaint)
    } catch (error) {
        res.status(500).json({message:error})
    }

}

const updateComplaintTotallyController = async (req,res) => {
    const {id} = req.params

    const orderData={
        id,
        ...req.body
    }
    
    try {
        const complaint = await complainModel.updateComplaintTotally(id, orderData)
        res.status(200).json(complaint)
    } catch (error) {
        res.status(500).json({message:error})
    }
}

const deleteComplaintController = async (req,res) => {
    const {id} = req.params

    try {
        const complaint = await complainModel.deleteComplaint(id)
        res.status(200).json({message:'Denuncia eliminada correctamente'})
    } catch (error) {
        res.status(500).json({message:error})
    }
}


export {
    registerComplaintController,
    getComplaintController,
    findComplaintController,
    updateComplaintController,
    updateComplaintTotallyController,
    deleteComplaintController
}