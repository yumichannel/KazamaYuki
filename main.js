require('dotenv').config();
const Bot = require('./models/Bot');
const MusicBot = require('./models/MusicBot');
const config = require('./models/config');
let bot = new Bot(config);
// new MusicBot(config);
process.on('unhandledRejection',err=>{
    console.log(err)
});
