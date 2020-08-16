const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../models/Bot');
const data = {
    caller: "",
    cd: 10,
    description: "",
    nsfw: false,
    help: "",
    enable: false,
    run: function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        
    }
}
module.exports = new Command(data)