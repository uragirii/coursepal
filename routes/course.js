const Teacher = require("../models/Teacher")
const Course = require("../models/Course")


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
    
    Course.create(newCourse).then((createdCourse)=>{
        Teacher.findOne({email:req.session.user.email}).then(teacher =>{
            teacher.courses.push(createdCourse)
            teacher.save()
            createdCourse.author.push(teacher)
            createdCourse.save()
        })
        res.redirect("/course/"+createdCourse._id)
    }).catch(err =>{console.err; res.redirect("/error")})
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
    Course.find({name : {$regex: regex, $options : 'i'}}).sort({ratings : "descending"}).limit(10).then(courses=>{
        payload.courses = courses
        res.render("courses", payload)
    }).catch(err =>{console.log(err); res.redirect("/error")})
}

module.exports.course = (req, res)=>{
    
    Course.findById(req.params.id).populate("author").then(course=>{
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
    }).catch(err =>{console.log(err); res.redirect("/error")})
}