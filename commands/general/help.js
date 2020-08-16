const Discord = require('discord.js');
const Command = require('../../models/Command');
const translater = require('../../models/config').translate;
const data = {
    caller: "help",
    cd: 0,
    enable: true,
    run: function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        
    }
}
module.exports = new Command(data)
