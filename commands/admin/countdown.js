const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "countdown",
    cd: 10,
    enable: false,
    run: function(msg=new Discord.Message,params=[]){
        var guild = msg.member.guild;
        if (!guild) return console.log(1);
        var channel = guild.channels.get(params[1])
        if (!channel) return console.log(2);
        var prefix = msg.client.data.get(guild.id).prefix;
        if (params[2].match(/^\d{1,}$/)){	
            let _time = parseInt(params[2]);	
			setTimeout(()=>{
                let content = msg.content.substring(prefix.length);
                content.replace(params[0],'').replace(params[1],'').replace(params[2],'').trim();
                channel.send(content);
                let m = (_time / 60).toFixed(0);
                let s = _time - m*60;
                msg.channel.send(`>>> Message will be triggered in ${m} munites and ${s} seconds`);
			},parseInt(_time));
		}
    }
}
module.exports = new Command(data)
