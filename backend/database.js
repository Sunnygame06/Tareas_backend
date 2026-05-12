import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/Tareas2B")

const connection = mongoose.connection;

connection.once("open", ()=>{
    console.log("DB is connected")
})

connection.on("disconnected", ()=>{
    console.log("DB is disconnected")
})

connection.on("error", (error)=>{
    console.log("Error encontrado" + error)
})