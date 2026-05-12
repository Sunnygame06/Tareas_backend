import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

import {config} from "../../config.js";

import studentModel from "../models/students.js";

const recoveryPasswordStudentController = {};

recoveryPasswordStudentController.rquestCode = async(req, res) => {
    try{
        const {email} = req.body;

        const studentFound = await studentModel.findOne({email});

        if(!studentFound){
            return res.status(404).json({message: "No se encontro"})
        }

        const randomCode = crypto.randomBytes(3).toString("hex")

        const token = jsonwebtoken.sign(
            {email, randomCode, userType: "student", verified: false},
            config.JWT.secret,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", token, {maxAge: 15 * 60 * 1000});

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.email.user_email,
                pass: config.email.user_password
            }
        })

        const mailOptions = {
            from: config.user_email,
            to: email,
            subject: "Código para restablecer de contraseña",
            text: "Este es tu código: " + randomCode
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log("error" + error)
                return res.status(500).json({message: "Internal Server Error"})
            }
            return res.status(200).json({message: "Codigo enviado"})
        })
    } catch (error){
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

recoveryPasswordStudentController.verifyCode = async(req, res) => {
    try{
        const {code} = req.body;

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if(code !== decoded.randomCode){
            return res.status(400).json({message: "Codigo incorrecto"})
        }

        const newToken = jsonwebtoken.sign(
            {email: decoded.email, userType: "student", verified: true},
            config.JWT.secret,
            {expiresIn: "15m"}
        )

        res.cookie("recoveryCookie", newToken, {maxAge: 15 * 60 * 1000})

        return res.status(200).json({message: "Codigo correcto"})
    }catch (error){
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

recoveryPasswordStudentController.newPassword = async(req, res) => {
    try{
        const {newPassword, confirmNewPassword} = req.body;

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: "Contraseñas no coinciden"})
        }

        const token = req.cookies.recoveryCookie
        const decoded = jsonwebtoken.verify(token, config.JWT.secret)

        if(!decoded.verified){
            return res.status(400).json({message: "error"})
        }

        const passwordHash = await bcrypt.hash(newPassword, 10)

        await studentModel.findOneAndUpdate(
            {email: decoded.email},
            {password: passwordHash},
            {new: true},
        )

        res.clearCookie("recoveryCookie")
        return res.status(200).json({message: "Contraseña actualizada"})
    } catch (error){
        console.log("error" + error)
        return res.status(500).json({message: "Internal Server Error"})
    }
};

export default recoveryPasswordStudentController;