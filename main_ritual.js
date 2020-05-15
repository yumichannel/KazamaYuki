require('dotenv').config();
var Discord = require('discord.js');
const Bot = require('./models/Bot');
var config = require('./models/config');
var bot = null;

var connector = new Discord.Client();
connector.on('message', message => {
    if (message.author.bot) return;
    if (message.author.id != process.env.owner) return;
    let connectorMention = message.mentions.members.get(connector.user.id);
    let firstChild = message.content.split(' ')[0];
    if (connectorMention && firstChild.search(connector.user.id)) {
        let contentArr = message.content.split(' ');
        contentArr.shift();
        let content = contentArr.join(' ').trim();
        // if (content === "THƯA NỮ THẦN, XIN HÃY ĐÁNH THỨC SAGIRI!!!") {
        if (content === "abc") {
            message.channel.send(`>>> *Để triệu hồi Sagiri, ${message.member.nickname} đã mất đi 1 năm tuổi thọ*`)
            .then(message => {
                setTimeout(()=>{
                    message.channel.send('>>> *Nghi lễ đánh thức thành công*')
                    .then(message => {
                        setTimeout(()=>{
                            if (bot) {
                                bot.client.startChannel = message.channel.id;
                                bot.client.login(config.token);
                            } else {
                                config.startChannel = message.channel.id;
                                bot = new Bot(config);
                            }
                        },1000);
                    })
                },1000)
            })
        }
    }
})
connector.login(process.env.connectToken);
