const Discord = require('discord.js');
const Command = require('../../models/Command');
const translater = require('../../models/config').translate.prefix_warn
const data = {
    caller: "prefix",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        var prefix = params[1]
        msg.client.data.get(msg.guild.id).setPrefix(prefix)
        msg.client.update_data()
        msg.channel.send(translater[msg.client.data.get(msg.guild.id).lang].replace("@prefix",prefix))
    }
}
module.exports = new Command(data)