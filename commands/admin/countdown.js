const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "countdown",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        var guild = msg.member.guild;
        if (!guild) return console.log(1);
        var channel = guild.channels.get(params[1])
        if (!channel) return console.log(2);
        if (params[2].match(/^\d{1,}$/)){		
			setTimeout(()=>{					
				params.splice(0,3);
				let content = msg.content.substring(1)
                    .replace(params[0],'')
                    .replace(params[1],'')
                    .replace(params[2],'').trim();
				channel.send(content);
			},parseInt(params[2]));
		}
    }
}
module.exports = new Command(data)