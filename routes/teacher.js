const bcrypt = require('bcrypt')
const Teacher = require("../models/Teacher")

module.exports.signup = (req, res)=>{
    
    // TODO: Check if email is already taken
    Teacher.findOne({email : req.body.email}).then(teacher=>{
        if(teacher){
            res.render("signupTeacher", {flash : "email"})
        }
        else{
            bcrypt.hash(req.body.password,10).then((hash)=>{
                newTeacher = {
                    name : req.body.name,
                    email : req.body.email,
                    rating : 0,
                    about : req.body.about,
                    avatarUrl : req.body.avatarUrl,
                    website : req.body.website,
                    hash
                }
                Teacher.create(newTeacher).then((createdTeacher)=>{
                    res.json(createdTeacher)
                }).catch(err =>{console.log(err); res.redirect("/error")})
            }).catch(err =>{console.log(err); res.redirect("/error")})
        }
    }).catch(err=>{console.log(err); res.redirect("/error")})
    
}

module.exports.login = (req, res)=>{
    let email = req.body.email
    let pass = req.body.password
    Teacher.findOne({email : email}).then(teacher=>{
        if(!teacher){
            res.render("loginTeacher", {flash : "email"})
        }
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
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.dashboard = (req, res) =>{
    Teacher.findOne({email : req.session.user.email}).populate("courses").exec((err, teacher)=>{
        if(err){
            console.error(err)
            res.redirect("/error")
        }
        else{
            res.render("dashboardTeacher", {courses : teacher.courses})
        }
    })
}