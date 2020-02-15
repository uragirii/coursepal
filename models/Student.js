const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    name : String,
    avatarUrl : String,
    courses : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Course"
        }
    ],
    email : String,
    hash : String
})

module.exports = mongoose.model("Student", studentSchema)