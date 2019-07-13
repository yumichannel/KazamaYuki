const fs = require('fs')
module.exports = function(data){
    return new Promise((resolve,reject)=>{
        try {
            fs.writeFileSync("models/database.json",JSON.stringify(data),{encoding:"utf8"})
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}