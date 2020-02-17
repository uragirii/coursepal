const bcrypt = require('bcrypt')
const Student = require("../models/Student")
const Teacher = require("../models/Teacher")


module.exports.signup = (req, res)=>{
    // TODO: Check if email is already taken
    bcrypt.hash(req.body.password,10).then((hash)=>{
        newStudent = {
            name : req.body.name,
            email : req.body.email,
            hash
        }
        Student.create(newStudent).then((createdStudent)=>{
            res.json(createdStudent)
        }).catch(err=>{console.error(err); res.send("Error occured")})
    })
}

module.exports.login = (req, res)=>{
    let email = req.body.email
    let pass = req.body.password

    Student.findOne({email : email}).then(student=>{
        if (bcrypt.compareSync(pass, student.hash)){
            req.session.user = {
                name : student.name,
                type : "Student",
                email : student.email
            }
            console.log("Logged in : "+student.name)
            res.redirect("/dasboard")
        }
        else{
            res.send("Password Incorrect")
        }
    })
}

module.exports.dashboard = (req, res)=>{
    Teacher.findOne({email : req.session.user.email}).populate("courses").exec((err, student)=>{
        if(err){
            console.error(err)
        }
        else{
            res.render("dashboardStudent", {courses : student.courses})
        }
    })
}