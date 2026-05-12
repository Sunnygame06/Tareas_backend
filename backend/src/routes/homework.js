import express from "express";
import homeworkController from "../controllers/homeworkController.js";

const router = express.Router();

router.route("/")
    .get(homeworkController.gethomework)
    .post(homeworkController.insertHomework);

router.route("/:id")
    .put(homeworkController.updateHomework)
    .delete(homeworkController.deleteHomework);

export default router;