import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

import {config} from "../../config.js";

import studentModel from "../models/students.js";

const loginStudentController = {};

loginStudentController.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        const studentFound = await studentModel.findOne({email})

        if(!studentFound){
            return res.status(404).json({message: "No se encontro"})
        }

        if(studentFound.timeOut && studentFound.timeOut>Date.now()){
            return res.status(403).json({message: "Usuario bloqueado"})
        }

        const isMatch = await bcrypt.compare(password, studentFound.password)

        if(!isMatch){
            studentFound.loginAttempts = (studentFound.loginAttempts || 0) + 1

            if(studentFound.loginAttempts >= 5){
                studentFound.timeOut = Date.now() + 5 * 60 * 1000;
                studentFound.loginAttempts = 0;

                await studentFound.save();

                return res.status(403).json({message: "Usuario bloqueado"})
            }
            await studentFound.save();

            return res.status(401).json({message: "Datos incorrectos"})
        }

        studentFound.loginAttempts = 0;
        studentFound.timeOut = null;

        const token = jsonwebtoken.sign(
            {id: studentFound._id, userType: "student"},
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

export default loginStudentController;