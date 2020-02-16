const Teacher = require("../models/Teacher")
const Course = require("../models/Course")


module.exports.new = (req, res)=>{
    if(!req.session.user || !req.session.user.type === "Teacher"){
        res.send("Unauthorized")
    }
    newCourse = req.body
    newCourse.ratings=0
    newCourse.studentsEnrolled=0
    newCourse.teacherName = req.session.user.name
    
    Course.create(newCourse).then((createdCourse)=>{
        Teacher.findOne({email:req.session.user.email}).then(teacher =>{
            teacher.courses.push(createdCourse)
            teacher.save()
            createdCourse.author.push(teacher)
            createdCourse.save()
        })
        res.json(createdCourse)
    }).catch(err =>{console.err; res.send("error occured")})
}

module.exports.allCourses = (req, res)=>{

    let regex = ".+"
    if (req.query.q){
        let arr = req.query.q.split(" ")
        let arr2 = arr.map(x => `.*${x}.*`)
        regex = arr2.join("|")
    }
    Course.find({name : {$regex: regex, $options : 'i'}}).sort({ratings : "descending"}).limit(10).then(courses=>{
        res.json(courses)
    })
}