const Discord = require('discord.js');
const Command = require('../../models/Command.js');
const translater = require('../../models/config').translate.language_warn
const data = {
    caller: "language",
    cd: 10,
    enable: true,
    run: function(msg=new Discord.Message,params=[]){
        var lang = params[1]
        var result = msg.client.data.get(msg.guild.id).setLang(lang)
        if(result){
            msg.client.update_data()
            msg.channel.send(translater[msg.client.data.get(msg.guild.id).lang][0])
        }else{
            msg.channel.send(translater[msg.client.data.get(msg.guild.id).lang][1])
        }
    }
}
module.exports = new Command(data)
