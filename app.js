const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const seed = require("./routes/seed")
const student = require("./routes/student")
const teacher = require("./routes/teacher")
const course = require("./routes/course")
const db = require("./database/database")
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
    res.locals.user = req.session.user
    next();
});
app.set('views', __dirname+'/views')
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

mongoose.connect("mongodb://localhost:27017/coursepal", {useNewUrlParser:true})


const loggedIn = (req, res, next)=>{
    if (req.session.user && req.cookies.user_sid){
        next();
    }
    else{
        res.redirect("/unauthorized")
    }
}



app.get("/",(req, res)=>{
    res.render("index")
})
app.get("/logout",loggedIn, (req, res)=>{
    res.clearCookie('user_ssid')
    req.session.user = undefined
    res.redirect("/")
})
app.get("/unauthorized", (req, res)=>{
    res.render("unauth")
})
app.get("/error", (req, res)=>{
    res.render("error")
})
app.get("/teacher", (req, res)=>{
    res.render("teacher")
})


app.get("/dashboard",loggedIn, (req, res)=>{
    if(req.session.user.type === "Teacher"){
        // Teacher Dashboard
        teacher.dashboard(req, res)
    }
    else{
        student.dashboard(req, res)
    }
})

app.get("/courses", course.allCourses)
app.get("/course/new",loggedIn, (req, res)=>{
    if(req.session.user.type !=="Teacher"){
        res.redirect("/unauthorized")
    }else{
        res.render("newcourse")
    }
})
app.post("/course/new",loggedIn, course.new)
app.get("/course/:id", course.course)
// Teacher Routes

app.post("/teacher/signup", teacher.signup )
app.get("/teacher/login", (req, res)=>{
    res.render("loginteacher", {flash : undefined})
})


app.post("/teacher/login", teacher.login)
app.get('/teacher/signup', (req, res)=>{
    res.render("signupTeacher", {flash : undefined})
})

//Student Routes
app.get("/student/enroll/:id", loggedIn,student.enrollCourse)
app.post("/student/signup", student.signup)
app.get("/student/login", (req, res)=>{
    res.render("loginStudent", {flash : undefined})
})
app.get('/student/signup', (req, res)=>{
    res.render("signupStudent",  {flash : undefined})
})
app.post("/student/login", student.login)
// API For Seeding the data 
app.post("/api/student/new", (req, res)=>{
    console.log(req.body)
    db.addStudent(req.body).then(()=>{
        res.send("Ok")
    }).catch(err=>{console.log(err);res.send("err")})
})

app.get("/api/seed/student/:times", seed.seedStudent)
app.get("/api/seed/teacher/:times", seed.seedTeacher)
app.get("/api/seed/course/new", seed.seedCourse)

app.get("/*", (req, res)=>{
    res.render("404")
})
app.listen(3000, ()=>{
    console.log("Server is running")
})