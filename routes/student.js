const bcrypt = require('bcrypt')
const Student = require("../models/Student")
const Course = require("../models/Course")


module.exports.signup = (req, res)=>{
    // TODO: Check if email is already taken
    bcrypt.hash(req.body.password,10).then((hash)=>{
        newStudent = {
            name : req.body.name,
            email : req.body.email,
            hash
        }
        Student.create(newStudent).then((createdStudent)=>{
            res.redirect("/student/login")
        }).catch(err=>{console.error(err); res.send("Error occured")})
    })
}

module.exports.login = (req, res)=>{
    let email = req.body.email
    let pass = req.body.password

    Student.findOne({email : email}).populate().then(student=>{
        if (bcrypt.compareSync(pass, student.hash)){
            let courses = []
            student.courses.forEach(course=> courses.push(course._id))
            req.session.user = {
                name : student.name,
                type : "Student",
                email : student.email,
                courses: courses
            }
            console.log("Logged in : "+student.name)
            res.redirect("/dashboard")
        }
        else{
            res.send("Password Incorrect")
        }
    })
}

module.exports.dashboard = (req, res)=>{
    Student.findOne({email : req.session.user.email}).populate("courses").exec((err, student)=>{
        if(err){
            console.error(err)
        }
        else{
            res.render("dashboardStudent", {courses : student.courses})
        }
    })
}

module.exports.enrollCourse = (req, res)=>{
    Course.findById(req.params.id).then(course=>{
        Student.findOne({email: req.session.user.email}).then(student=>{
            student.courses.push(course)
            course.studentsEnrolled += 1
            student.save()
            course.save()
            res.redirect("/course/"+req.params.id)
        })
    }).catch(err => {res.send("Err")})
}