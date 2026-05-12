import express from "express";
import teacherController from "../controllers/teacherController.js";

const router = express.Router();

router.route("/").get(teacherController.getTeachers);

router.route("/:id")
    .put(teacherController.updateTeachers)
    .delete(teacherController.deleteTeacher);

export default router;