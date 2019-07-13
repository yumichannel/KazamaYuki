module.exports = function(){
    const data = require('../models/database.json')
    console.log(data)
    delete require.cache[require.resolve('../models/database.json')]
}