import express from "express";
import recoveryPasswordStudentController from "../controllers/recoveryPasswordStudentController.js";

const router = express.Router();

router.route("/requestCode").post(recoveryPasswordStudentController.rquestCode)
router.route("/verifyCode").post(recoveryPasswordStudentController.verifyCode)
router.route("/newPassword").post(recoveryPasswordStudentController.newPassword)

export default router;