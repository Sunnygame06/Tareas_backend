import express from "express";
import loginStudentController from "../controllers/loginStudentController.js";

const router = express.Router();

router.route("/").post(loginStudentController.login);

export default router;