const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "countdown",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        // console.log(params[1],params[2],params[3]);
        // return;
        var guild = msg.member.guild;
        if (!guild) return;
        var channedl = guild.channels.get(params[1])
        if (!channedl) return;
        if (!params[2].match(new RegExp('/^\d{1,}$/'))) return;
        params.splice(0,3);
        var content = params.join(' ');
        setTimeout(()=>{
            msg.channel.send(content);
        },parseInt(params[2]));
    }
}
module.exports = new Command(data)