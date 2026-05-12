import subjectModel from "../models/Subjects.js";

const subjectController = {};

subjectController.getsubject = async(req, res) => {
    try{
        const subjects = await subjectModel.find();
        return res.status(200).json(subjects)
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

subjectController.insertSubject = async(req, res) => {
    const {
        subjectName,
        teacher_id,
        isAvailable
    } = req.body;

    const newSubject = new subjectModel({
        subjectName,
        teacher_id,
        isAvailable
    });

    await newSubject.save();

    res.json({message: "guardado correctamente"})
}

subjectController.updateSubject = async (req, res) => {
    try{
        let{
            subjectName,
            teacher_id,
            isAvailable
        } = req.body;

        subjectName=subjectName?.trim();

        if(!subjectName){
            return res.status(400).json({message: "Faltan campos"})
        }

        if(subjectName.length<10 || subjectName.length>20){
            return res.status(400).json({message: "Nombre mal escrito"})
        }

        const subjectUpdated = await subjectModel.findByIdAndUpdate(req.params.id, {
            subjectName,
            teacher_id,
            isAvailable
        },
        {new: true},);

        if(!subjectUpdated){
            return res.status(404).json({message: "No se encontro"})
        }

        return res.status(200).json({message: "Materia actualizada"})
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

subjectController.deleteSubject = async(req, res) => {
    try{
        const deletedSubject = await subjectModel.findByIdAndDelete(req.params.id);

        if(!deletedSubject){
            return res.status(404).json({message: "No se encontro"}) 
        }

        return res.status(200).json({message: "Eliminado correctamente"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default subjectController;