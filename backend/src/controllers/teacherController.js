import teacherModel from "../models/teachers.js";

const teachersController = {};

teachersController.getTeachers = async(req, res) => {
    try{
        const teachers = await teacherModel.find();
        return res.status(200).json(teachers)
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

teachersController.updateTeachers = async (req, res) => {
    try{
        let{
            name,
            lastName,
            email,
            password,
            phone,
            speciality,
            isActive,
            isVerified
        } = req.body;

        name=name?.trim();
        email=email?.trim();

        if(!name || !email || !password){
            return res.status(400).json({message: "Faltan campos"})
        }

        if(name.length<3 || name.length>15){
            return res.status(400).json({message: "Nombre mal escrito"})
        }

        const teacherUpdated = await teacherModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            email,
            password,
            phone,
            speciality,
            isActive,
            isVerified,
        },
        {new: true},);

        if(!teacherUpdated){
            return res.status(404).json({message: "No se encontro"})
        }

        return res.status(200).json({message: "Maestro actualizado"})
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

teachersController.deleteTeacher = async(req, res) => {
    try{
        const deletedTeacher = await teacherModel.findByIdAndDelete(req.params.id);

        if(!deletedTeacher){
            return res.status(404).json({message: "No se encontro"}) 
        }

        return res.status(200).json({message: "Eliminado correctamente"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default teachersController;