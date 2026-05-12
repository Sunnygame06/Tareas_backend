import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import {config} from "../../config.js";

import teacherModel from "../models/teachers.js";

const loginTeacherController = {};

loginTeacherController.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const teacherFound = await teacherModel.findOne({email})

        if(!teacherFound){
            return res.status(404).json({message: "No se encontro"})
        }

        if(teacherFound.timeOut && teacherFound.timeOut>Date.now()){
            return res.status(403).json({message: "Usuario bloqueado"})
        }

        const isMatch = await bcrypt.compare(password, teacherFound.password)

        if(!isMatch){
            teacherFound.loginAttempts = (teacherFound.loginAttempts || 0) + 1

            if(teacherFound.loginAttempts >= 5){
                teacherFound.timeOut = Date.now() + 5 * 60 * 1000;
                teacherFound.loginAttempts = 0;

                await teacherFound.save();

                return res.status(403).json({message: "Usuario bloqueado"})
            }
            await teacherFound.save();

            return res.status(401).json({message: "Datos incorrectos"})
        }

        teacherFound.loginAttempts = 0;
        teacherFound.timeOut = null;

        const token = jsonwebtoken.sign(
            {id: teacherFound._id, userType: "teacher"},
            config.JWT.secret,
            {expiresIn: "30d"}
        )

        res.cookie("authCookie", token)

        return res.status(200).json({message: "Login exitoso"})
    }catch (error){
        console.log("error"+ error)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

export default loginTeacherController;