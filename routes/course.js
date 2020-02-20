// const Teacher = require("../models/Teacher")
// const Course = require("../models/Course")
const db = require("../database/database")


module.exports.new = (req, res)=>{
    // console.log(JSON.stringify(req.body))
    // res.send("ok")
    if(!req.session.user || !req.session.user.type === "Teacher"){
        res.send("Unauthorized")
    }
    newCourse = req.body
    newCourse.ratings=Math.floor(Math.random()*5)
    newCourse.studentsEnrolled=Math.floor(Math.random()*76543)
    newCourse.teacherName = req.session.user.name
    
    db.createCourse(newCourse).then((createdCourse)=>{
        db.findOne("teachers", req.session.user.email).then(teacher=>{
            teacher.courses.push(createdCourse._id)
            return db.saveData("teachers",teacher.email, teacher)
        }).then(()=>{
            res.redirect("/course/"+createdCourse._id)
        }).catch(err =>{console.error(err); res.redirect("/error")})
    }).catch(err =>{console.error(err); res.redirect("/error")})
}

module.exports.allCourses = (req, res)=>{
    let payload = {
        query : false
    }
    let regex = ".+"
    if (req.query.q){
        let arr = req.query.q.split(" ")
        let arr2 = arr.map(x => `.*${x}.*`)
        regex = arr2.join("|")
        payload.query = true
    }
    db.find("courses", regex).then((courses)=>{
        payload.courses = courses
        res.render("courses", payload)
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.course = (req, res)=>{
    db.getData("courses", req.params.id).then(course=>{
        if(course){
            let enroll = false
            if(req.session.user && req.session.user.type!=="Teacher"){
                console.log(req.session.user.courses.includes(req.params.id))
                enroll = req.session.user.courses.includes(req.params.id)
            }
            res.render("course", {course: course, enrolled:enroll})
        }
        else{
            res.render("404")
        }
    })
}