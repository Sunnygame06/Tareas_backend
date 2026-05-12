import categoryModel from "../models/categorys.js";

const categoryController = {};

categoryController.getCategory = async(req, res) => {
    try{
        const categorys = await categoryModel.find();
        return res.status(200).json(categorys)
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

categoryController.insertCategory = async(req, res) => {
    const {
        categoryName,
        description,
        color,
        isActive
    } = req.body;

    const newCategory = new categoryModel({
        categoryName,
        description,
        color,
        isActive
    });

    await newCategory.save();

    res.json({message: "guardado correctamente"})
}

categoryController.updateCategory = async (req, res) => {
    try{
        let{
            categoryName,
            description,
            color,
            isActive
        } = req.body;

        categoryName=categoryName?.trim();
        description=description?.trim();

        if(!categoryName || !description){
            return res.status(400).json({message: "Faltan campos"})
        }

        if(categoryName.length<5 || categoryModel.length>20){
            return res.status(400).json({message: "Nombre de la categoria mal escrito"})
        }

        const categoryUpdated = await categoryModel.findByIdAndUpdate(req.params.id, {
            categoryName,
            description,
            color,
            isActive
        },
        {new: true},);

        if(!categoryUpdated){
            return res.status(404).json({message: "No se encontro"})
        }

        return res.status(200).json({message: "Categoria actualizada"})
    } catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

categoryController.deleteCategory = async(req, res) => {
    try{
        const deletedCategory = await categoryModel.findByIdAndDelete(req.params.id);

        if(!deletedCategory){
            return res.status(404).json({message: "No se encontro"}) 
        }

        return res.status(200).json({message: "Eliminado correctamente"})
    }catch (error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default categoryController;