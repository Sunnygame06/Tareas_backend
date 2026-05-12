import nodemailer from "nodemailer";
import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { config } from "../../config.js"; 
import studentModel from "../models/students.js"

const registerStudentController = {};

registerStudentController.register = async (req, res) => {
    try{
        const{
            name,
            lastName,
            email, 
            password,
            birthdate,
            phone,
            grade,
            isVerified,
            loginAttempts,
            timeOut
        } = req.body;

        const exitsStudent = await studentModel.findOne({email});
        
        if(exitsStudent){
            return res.status(400).json({message: "No se encontro"})
        }

        const passwordHashed = await bcryptjs.hash(password, 10)

        const randomCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign({
            randomCode,
            name,
            lastName,
            email, 
            password: passwordHashed,
            birthdate,
            phone,
            grade,
            isVerified,
            loginAttempts,
            timeOut
            },
            config.JWT.secret,
            {expiresIn: "15m"}
        );

        res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000})

        const Transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: config.email.user_email,
                pass: config.email.user_password
            },
        });

        const mailOptions = {
            from: config.email.user_email,
            to: email,
            subject: "Código para registrar estudiante",
            text: "Este es tu código: " + randomCode
        };

        Transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
                console.log("error" + error)
                return res.status(500).json({message: "Internal Server Error"})
            }
            return res.status(200).json({message: "Correo enviado"})
        })
    }catch (error){
        console.log("error"+ error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

registerStudentController.verifyCode = async(req, res) => {
    try{
        const {verificationCodeRequest} = req.body;
        
        const token = req.cookies.registrationCookie

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const {
            randomCode: storedCode,
            name,
            lastName,
            email, 
            password,
            birthdate,
            phone,
            grade,
            isVerified,
            loginAttempts,
            timeOut
        } = decoded

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Código invalido"})
        }

        const newStudent = studentModel({
            name,
            lastName,
            email, 
            password,
            birthdate,
            phone,
            grade,
            isVerified: true,
            loginAttempts,
            timeOut
        })

        await newStudent.save();
    }
}