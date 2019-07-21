module.exports = function(){
    return new Promise((resolve,reject)=>{
        const data = require('../models/database.json')
        delete require.cache[require.resolve('../models/database.json')]
        resolve(data);
    })
}