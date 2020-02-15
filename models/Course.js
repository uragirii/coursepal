const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
    name : String,
    author : [
        {type : mongoose.Types.ObjectId, ref : "Teacher"}
    ],
    teacherName : String,
    language : String,
    ratings : Number,
    studentsEnrolled : Number,
    totalTime : Number,
    cost : Number,
    desc : String,
    content : [
        {
            type : Object
        }
    ]
})

module.exports = mongoose.model("Course", courseSchema)