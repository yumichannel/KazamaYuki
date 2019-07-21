require('dotenv').config();
const Bot = require('./models/Bot');
const config = require('./models/config');
new Bot(config);
process.on('unhandledRejection',err=>{
    console.log(err)
})