const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "countdown",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        console.log(params[1],params[2],params[3]);
        return;
        var guild = msg.member.guild;
        var channedl = guild.channels.get(params[1])
        guilds.forEach(guild=>{
            var channel;
            if (!guildExtend.welcomeChannel) return
            var em = new Discord.RichEmbed();
            em.setTitle("Notice from the creator!")
            em.setDescription(args)
            if(!channel){
                channel= guild.channels.find(c=>c.type=="text"&&c.permissionsFor(guild.me).has("SEND_MESSAGES"))
                em.addBlankField();
                em.addField("For Guild Master","If you're Admin,you should create a `bot-logs` or `bot-spam` channel for Yumi's notice :3 Thanks!")
            }
            channel.send(em);
        })
    }
}
module.exports = new Command(data)