const bcrypt = require('bcrypt')
// const Teacher = require("../models/Teacher")
const db = require("../database/database")

module.exports.signup = (req, res)=>{
    db.findOne("teachers", req.body.email).then(teacher=>{
        if(teacher){
            res.render("signupTeacher", {flash : "email"})
        }
        else{
            bcrypt.hash(req.body.password,10).then((hash)=>{
                newTeacher = {
                    name : req.body.name,
                    email : req.body.email,
                    rating : 0,
                    courses : [],
                    about : req.body.about,
                    avatarUrl : req.body.avatarUrl,
                    website : req.body.website,
                    hash
                }
                db.createTeacher(newTeacher).then((createdTeacher)=>{
                    res.redirect("/teacher/login")
                }).catch(err =>{console.log(err); res.redirect("/error")})
            }).catch(err =>{console.log(err); res.redirect("/error")})
        }
    }).catch(err=>{console.log(err); res.redirect("/error")})
}

module.exports.login = (req, res)=>{
    let email = req.body.email
    let pass = req.body.password
    db.findOne("teachers", email).then(teacher=>{
        if(!teacher){
            res.render("loginTeacher", {flash : "email"})
        }
        else{
            if (bcrypt.compareSync(pass, teacher.hash)){
                req.session.user = {
                    name : teacher.name,
                    type : "Teacher",
                    avatarUrl : teacher.avatarUrl,
                    email : teacher.email
                }
                console.log("Logged In : "+teacher.name)
                res.redirect("/dashboard")
            }
            else{
                res.render("loginTeacher", {flash : "password"})
            }
        }
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.dashboard = (req, res) =>{
    db.findOne("teachers", req.session.user.email).then(newTeacher=>{
        db.populate("courses", "courses", newTeacher).then(teacher=>{
            res.render("dashboardTeacher", {courses : teacher.courses})
        }).catch(err =>{console.log(err); res.redirect("/error")})
    }).catch(err =>{console.log(err); res.redirect("/error")})
}