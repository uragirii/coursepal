const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name : String,
    avatarUrl : String,
    about : String,
    website : String,
    courses : [
        {
            type : mongoose.Types.ObjectId,
            ref : "Course"
        }
    ],
    rating : Number,
    email : String,
    hash : String
})

module.exports = mongoose.model("Teacher", teacherSchema)