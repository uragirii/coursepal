const Teacher = require("../models/Teacher")
const Course = require("../models/Course")


module.exports.new = (req, res)=>{
    if(!req.session.user || !req.session.user.type === "Teacher"){
        res.send("Unauthorized")
    }
    newCourse = req.body
    newCourse.ratings=0
    newCourse.studentsEnrolled=0
    newCourse.teacherName = req.session.user.name
    
    Course.create(newCourse).then((createdCourse)=>{
        Teacher.findOne({email:req.session.user.email}).then(teacher =>{
            teacher.courses.push(createdCourse)
            teacher.save()
            createdCourse.author.push(teacher)
            createdCourse.save()
        })
        res.json(createdCourse)
    }).catch(err =>{console.err; res.send("error occured")})
}