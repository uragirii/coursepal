const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
//Models
const Student = require("./models/Student")
const Teacher = require("./models/Teacher")
const Course = require("./models/Course")

const app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    key: 'user_sid',
    secret: 'This is a random string @34q',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie('user_sid');        
    }
    next();
});
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/coursepal", {useNewUrlParser:true})

const logginIn = (req, res, next)=>{
    if (req.session.user && req.cookies.user_sid){
        next();
    }
    else{
        res.status(403).send("Unauthorized")
    }
}



app.get("/",(req, res)=>{
    res.render("index")
})

app.post("/teacher/signup", (req, res)=>{
    
    // TODO: Check if email is already taken
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
        }).catch(err=>{console.error(err); res.send("Error occured")})
    })
})

app.post("/student/signup", (req, res)=>{
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
})

app.post("/courses/new", (req, res)=>{
    //TODO:check for authorization
    newCourse = req.body
    newCourse.ratings=0
    newCourse.studentsEnrolled=0
    newCourse.teacherName = "Colt Steele"
    Course.create(newCourse).then((createdCourse)=>{
        res.json(createdCourse)
    }).catch(err =>{console.err; res.send("error occured")})
})

app.listen(3000, ()=>{
    console.log("Server is running")
})