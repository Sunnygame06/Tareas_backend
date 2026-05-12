import express from "express";
import registerStudentRoutes from "./src/routes/registerStudent.js";
import studentRoutes from "./src/routes/student.js"
import loginStudentRoutes from "./src/routes/loginStudent.js"
import recoveryPasswordStudentRoutes from "./src/routes/recoveryPasswordStudent.js"
import homeworkRoutes from "./src/routes/homework.js"
import categoryRoutes from "./src/routes/category.js"
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

app.use(cookieParser());

app.use(express.json());

app.use("/api/registerStudent", registerStudentRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/loginStudent", loginStudentRoutes);
app.use("/api/recoveryPassStudent", recoveryPasswordStudentRoutes)
app.use("/api/homework", homeworkRoutes);
app.use("/api/category", categoryRoutes);

export default app;