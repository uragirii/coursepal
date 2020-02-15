const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
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



app.listen(3000, ()=>{
    console.log("Server is running")
})