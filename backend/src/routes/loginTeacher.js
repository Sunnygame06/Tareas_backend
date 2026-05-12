import express from "express";
import loginTeacherController from "../controllers/loginTeacherController.js";

const router = express.Router();

router.route("/").post(loginTeacherController.login);

export default router;