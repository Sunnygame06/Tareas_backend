/*
    subjectName,
    teacher_id,
    isAvailable
*/

import {Schema, model} from "mongoose";

const subjectSchema = new Schema({
    SubjectName: {type: String},
    teacher_id: {type: Schema.Types.ObjectId, ref: "Teacher"},
    isAvailable: {type: Boolean}
},{
    timestamps: true,
    strict: false
})

export default model("Subject", subjectSchema)