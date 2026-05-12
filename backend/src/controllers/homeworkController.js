import HomeworkModel from "../models/homeworks.js";

const homeworkController = {};

homeworkController.gethomework = async(req, res) => {
    try{
        const homeworks = await HomeworkModel.find();
        return res.status(200).json(homeworks)
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

homeworkController.insertHomework = async(req, res) => {
    const {
        title,
        description,
        dueDate,
        priority,
        status
    } = req.body;

    const newHomework = new HomeworkModel({title,
        description,
        dueDate,
        priority,
        status
    });

    await newHomework.save();

    res.json({message: "guardado correctamente"})
}

homeworkController.updateHomework = async (req, res) => {
    try{
        let{
            title,
            description,
            dueDate,
            priority,
            status
        } = req.body;

        title=title?.trim();
        description=description?.trim();

        if(!title || !description){
            return res.status(400).json({message: "Faltan campos"})
        }

        if(title.length<10 || title.length>20){
            return res.status(400).json({message: "Titulo mal escrito"})
        }

        const homeworkUpdated = await HomeworkModel.findByIdAndUpdate(req.params.id, {
            title,
            description,
            dueDate,
            priority,
            status
        },
        {new: true},);

        if(!homeworkUpdated){
            return res.status(404).json({message: "No se encontro"})
        }

        return res.status(200).json({message: "Tarea actualizada"})
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

homeworkController.deleteHomework = async(req, res) => {
    try{
        const deletedHomework = await HomeworkModel.findByIdAndDelete(req.params.id);

        if(!deletedHomework){
            return res.status(404).json({message: "No se encontro"}) 
        }

        return res.status(200).json({message: "Eliminado correctamente"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default homeworkController;