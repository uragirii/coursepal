const bcrypt = require('bcrypt')
const db = require('../database/database')

module.exports.signup = (req, res)=>{
    db.findOne("students", req.body.email).then(student=>{
        if(student){
            res.render("signupStudent", {flash : "email"})
        }
        else{
            bcrypt.hash(req.body.password,10).then((hash)=>{
                newStudent = {
                    name : req.body.name,
                    email : req.body.email,
                    courses : [],
                    hash
                }
                db.createStudent(newStudent).then(createdStudent=>{
                    res.redirect("/student/login")
                }).catch(err =>{console.log(err); res.redirect("/error")})
            }).catch(err =>{console.log(err); res.redirect("/error")})
        }
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.login = (req, res)=>{
    let email = req.body.email
    let pass = req.body.password
    db.findOne("students", email).then(student=>{
        if(!student){
            res.render("loginStudent", {flash : "email"})
        }
        else{
            if(bcrypt.compareSync(pass, student.hash)){
                req.session.user = {
                    name : student.name,
                    type : "Student",
                    email : student.email,
                    courses: student.courses
                }
                console.log("Logged in : "+student.name)
                res.redirect("/dashboard")
            }
            else{
                res.render("loginStudent", {flash : "password"})
            }
        }
    }).catch(err=>{console.log(err);res.redirect("/error")})
}

module.exports.dashboard = (req, res)=>{
    db.findOne("students", req.session.user.email).then(newStudent=>{
        db.populate("courses", "courses", newStudent).then(student=>{
            res.render("dashboardStudent", {courses : student.courses})
        }).catch(err =>{console.log(err); res.redirect("/error")})
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.enrollCourse = (req, res)=>{
    db.findOne("students", req.session.user.email).then(student=>{
        student.courses.push(req.params.id)
        db.saveData("students", req.session.user.email, student).then(()=>{
            req.session.user.courses.push(req.params.id)
            res.redirect("/course/"+req.params.id)
        }).catch(err =>{console.log(err); res.redirect("/error")})
    }).catch(err =>{console.log(err); res.redirect("/error")})
}