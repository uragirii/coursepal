const Student = require("../models/Student")
const Teacher = require("../models/Teacher")
const Course = require("../models/Course")

const faker = require("faker")
const bcrypt = require("bcrypt")

module.exports.seedStudent = (req, res)=>{
    const dataNum = Number(req.params.times | 1)
    for(let i=0;i<dataNum;++i){
        newStudent = {
            name : faker.name.findName(),
            email : faker.internet.email(),
            hash : bcrypt.hashSync("password", 10)
        }
        Student.create(newStudent).then(createdStudent=>{
            console.log("Created Student : "+createdStudent.name)
        })
    }
    res.send("OK")
}

module.exports.seedTeacher = (req, res)=>{
    const dataNum = Number(req.params.times | 1)
    for(let i =0;i<dataNum;++i){
        newTeacher = {
            name : faker.name.findName(),
            email : faker.internet.email(),
            hash : bcrypt.hashSync("password", 10),
            avatarUrl : faker.internet.avatar(),
            about : faker.random.words(20),
            website : faker.internet.domainName(),
            rating : Math.round(Math.random()*5)
        }
        Teacher.create(newTeacher).then(createdTeacher=>{
            console.log("Created Teacher : "+createdTeacher.name)
        })
    }
    res.send("OK")
}

module.exports.seedCourse = (req, res)=>{
    const teacherEmail = req.headers.email
    newCourse = {
        name : faker.random.words(3),
        language : "English",
        rating : Math.round(Math.random()*5),
        studentsEnrolled : 0,
        totalTime: Math.round(Math.random()*50),
        cost : Math.round(Math.random()*4000),
        desc : faker.random.words(50),
        content : [
            {
                name : "Week 1",
                sections : ['section1', 'section2'  ],
                time : 2
            },
            {
                name : "Week 1",
                sections : ['section1', 'section2'  ],
                time : 4
            }
        ]
    }
    Course.create(newCourse).then(createdCourse =>{
        Teacher.findOne({email : req.headers.email}).then(teacher=>{
            teacher.courses.push(createdCourse)
            teacher.save()
            createdCourse.author.push(teacher)
            createdCourse.teacherName = teacher.name
            createdCourse.save()
        })
        console.log("Created course : "+createdCourse.name)
    })
    res.send("OK")
}