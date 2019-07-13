const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "pat",
    cd: 5,
    run: function(msg=new Discord.Message,params=[]){
        const list = [
            "https://i.imgur.com/JHdnsWA.gif",
            "https://i.imgur.com/nI532vE.gif",
            "https://i.imgur.com/H39vHeH.gif"
        ]
        const index = Math.floor(Math.random()*3)
        const pater = msg.member
        const patted = msg.mentions.members.first()
        var text;
        if(args==""){
            text = `${pater.displayName} try patting yourself huh???`
        } else{
            text = (pater.id==patted.id)?`${msg.guild.members.get(msg.client.user.id).displayName} pat pat pat ${pater.displayName}`:`${pater.displayName} pat pat ${patted.displayName}`
        }
        var embed = new Discord.RichEmbed()
        .setDescription(text)
        .setImage(list[index])
        msg.channel.send(embed)
    }
}
module.exports = new Command(data)