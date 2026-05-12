import studentModel from "../models/students.js";

const studentController = {};

studentController.getStudents = async(req, res) => {
    try{
        const students = await studentModel.find();
        return res.status(200).json(students)
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

studentController.updateStudents = async (req, res) => {
    try{
        let{
            name,
            lastName,
            email, 
            password,
            birthdate,
            phone,
            grade
        } = req.body;

        name=name?.trim();
        email=email?.trim();

        if(!name || !email || !password){
            return res.status(400).json({message: "Faltan campos"})
        }

        if(name.length<3 || name.length>15){
            return res.status(400).json({message: "Nombre mal escrito"})
        }

        const studentUpdated = await studentModel.findByIdAndUpdate(req.params.id, {
            name,
            lastName,
            email, 
            password,
            birthdate,
            phone,
            grade
        },
        {new: true},);

        if(!studentUpdated){
            return res.status(404).json({message: "No se encontro"})
        }

        return res.status(200).json({message: "Estudiante actualizado"})
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

studentController.deleteStudent = async(req, res) => {
    try{
        const deletedStudent = studentModel.findByIdAndDelete(req.params.id);

        if(!deletedStudent){
            return res.status(404).json({message: "No se encontro"}) 
        }

        return res.status(200).json({message: "Eliminado correctamente"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default studentController;