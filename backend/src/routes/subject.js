import express from "express";
import subjectController from "../controllers/subjectController.js";

const router = express.Router();

router.route("/")
    .get(subjectController.getsubject)
    .post(subjectController.insertSubject);

router.route("/:id")
    .put(subjectController.updateSubject)
    .delete(subjectController.deleteSubject);

export default router;