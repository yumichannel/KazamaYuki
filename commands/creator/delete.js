const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "clear",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        msg.channel.fetchMessages().then(messages=>{
            messages.forEach(message=>{
                message.delete()
            })
        })
    }
}
module.exports = new Command(data)