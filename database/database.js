const fs = require('fs')
const util = require('util')
const uuid = require('uuid/v4')
const readFile = util.promisify(fs.readFile)


function writeData(type, fileData){
    return new Promise((resolve, reject)=>{
        let id = fileData.email
        
        if(type==="courses"){
            id = uuid()
            fileData._id = id;
        }
        readFile(`./database/data/${type}/index.json`).then(data=>{            
            data = JSON.parse(data)
            if(type === "courses"){
                data.push({
                    id : id,
                    name : fileData.name
                })
            }
            else{
                data.push(id)
            }
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
        data[key] = populated
        resolve(data)
    })
}

module.exports.saveData = (type, id, data)=>{
    return new Promise((resolve, reject)=>{
        fs.writeFile(`./database/data/${type}/${id}.json`, JSON.stringify(data), (err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve(true)
            }
        })
    })
}

module.exports.getData = (type, id)=>{
    return new Promise((resolve, reject)=>{
        readFile(`./database/data/${type}/${id}.json`).then(data=>{
            resolve(JSON.parse(data))
        }).catch(err=>{console.log(err); reject(err)})
    })
}

module.exports.find = (type, query) =>{
    return new Promise((resolve, reject)=>{
        readFile(`./database/data/${type}/index.json`).then(data=>{
            data = JSON.parse(data)
            let resultId = []
            query = new RegExp(query, 'i')
            resultId = data.filter((x)=>{ return query.test(x.name.toLowerCase())})        
            resultId = resultId.map((x)=>x.id) 
            if (resultId.length<1){
                console.log("No results found")
                resolve(resultId)
            }
            return resultId
        }).then(ids=>{
            let results = []
            let processed = 0;
            ids.forEach((id, i, arr)=>{
                readFile(`./database/data/${type}/${id}.json`).then(data=>{
                    data= JSON.parse(data)
                    results.push(data)
                    processed++;
                    if(processed === arr.length){
                        resolve(results)
                    }
                }).catch(err=> {console.log(err); reject(err)})
            })
        }).catch(err=> {console.log(err); reject(err)})
    })
}