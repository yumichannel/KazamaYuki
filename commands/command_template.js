const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        
    }
}
module.exports = new Command(data)