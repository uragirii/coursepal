const bcrypt = require('bcrypt')
const Student = require("../models/Student")

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