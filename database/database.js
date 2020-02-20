const fs = require('fs')
const util = require('util')
const uuid = require('uuid/v4')
const readFile = util.promisify(fs.readFile)


function writeData(type, fileData){
    return new Promise((resolve, reject)=>{
        const id = fileData.email
        if(type==="courses"){
            id = uuid()
        }
        readFile(`./database/data/${type}/index.json`).then(data=>{            
            data = JSON.parse(data)
            data.push(id)
            fs.writeFile(`./database/data/${type}/index.json`, JSON.stringify(data),(err)=>{
                if(err){
                    reject(err)
                }
                fs.writeFile(`./database/data/${type}/${id}.json`, JSON.stringify(fileData), (err)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(true)
                    }
                })
            })
        }).catch(err=>{reject(err)})
    })
}

module.exports.createStudent = data=>{
    return new Promise((resolve, reject)=>{
        writeData("students", data).then(write =>{
            resolve(data)
        }).catch(err => {reject(err)})
    })
}
module.exports.createTeacher = data=>{
    return new Promise((resolve, reject)=>{
        writeData("teachers", data).then(write =>{
            resolve(data)
        }).catch(err => {reject(err)})
    })
}

module.exports.createCourse = data=>{
    return new Promise((resolve, reject)=>{
        writeData("courses", data).then(write =>{
            resolve(data)
        }).catch(err => {reject(err)})
    })
}

module.exports.findOne = (type, id)=>{
    // this function checks if the type is there or not
    return new Promise((resolve, reject)=>{
        readFile(`./database/data/${type}/index.json`).then(data=>{
            data = JSON.parse(data)
            if(data.includes(id)){
                readFile(`./database/data/${type}/${id}.json`).then(data=>{
                    resolve(JSON.parse(data))
                }).catch(err=>{reject(err)})
            }
            else{
                resolve(undefined)
            }
        }).catch(err=>{reject(err)})
    })
}

module.exports.populate = (type, key, data)=>{
    return new Promise((resolve, reject)=>{
        let populated = []
        data[key].forEach(id=>{
            readFile(`./database/data/${type}/${id}.json`).then(courseData=>{
                populated.push(courseData)
            }).catch(err=>{reject(err)})
        })
        resolve(populated)
    })
}