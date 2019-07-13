const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "avatar",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        const mention = msg.mentions.members
        var url = ""
        if(mention.size==0){
            url = msg.author.displayAvatarURL
        }else{
            url = mention.first().user.displayAvatarURL
        }
        msg.channel.send("",{embed:{
            image:{
                url:url,
                width: 250
            }
        }})
    }
}
module.exports = new Command(data)