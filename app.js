const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const seed = require("./routes/seed")
const student = require("./routes/student")
const teacher = require("./routes/teacher")
const course = require("./routes/course")

//Models


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

// TODO: Make custom Unauthorized page

const loggedIn = (req, res, next)=>{
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

app.get("/courses", (req, res)=>{

    let regex = ".+"
    if (req.query.q){
        let arr = req.query.q.split(" ")
        let arr2 = arr.map(x => `.*${x}.*`)
        regex = arr2.join("|")
    }
    Course.find({name : {$regex: regex, $options : 'i'}}).sort({ratings : "descending"}).limit(10).then(courses=>{
        res.json(courses)
    })
})
app.post("/courses/new", course.new)

// Teacher Routes

app.post("/teacher/signup", teacher.signup )
app.post("/teacher/login", teacher.login)

//Student Routes

app.post("/student/signup", student.signup)

// API For Seeding the data 

app.get("/api/seed/student/:times", seed.seedStudent)
app.get("/api/seed/teacher/:times", seed.seedTeacher)
app.get("/api/seed/course/new", seed.seedCourse)

app.listen(3000, ()=>{
    console.log("Server is running")
})