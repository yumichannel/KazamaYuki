const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "status",
    cd: 1,
    run: function(msg=new Discord.Message,params=[]){
        var em = new Discord.RichEmbed()
        em.setThumbnail(msg.client.user.displayAvatarURL)
        em.setTitle("Status of Bot")
        em.setDescription("--------------------------------------")
        em.addField("Developer",process.env.devname||`<@${process.env.owner}>`||"unknown",true)
        em.addField("Uptime",msg.client.uptime,false)
        em.addField("Server handle",msg.client.guilds.size,true)
        em.addField("Channel handle",msg.client.channels.size,true)
        em.addField("Command handle",msg.client.commands.size,true)
        em.addField("Memory usage",(process.memoryUsage().heapUsed/1024/1024).toFixed(2)+" MB",true)
        var now = Date.now();
        msg.channel.send("Collecting info...").then(m=>{
            var newtime = Date.now()
            em.addField("Heart beat",msg.client.ping.toFixed(0)+"ms",true)
            em.addField("Ping",newtime-now+"ms",true)
            m.edit(em);
        })
    }
};
module.exports = new Command(data)
