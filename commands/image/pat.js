const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "pat",
    cd: 5,
    translate: require('../../models/lang/pat.json'),
    run: function(msg=new Discord.Message,params=[]){
        const lang = msg.client.data.get(msg.guild.id).lang;
        const list = [
            "https://i.imgur.com/JHdnsWA.gif",
            "https://i.imgur.com/nI532vE.gif",
            "https://i.imgur.com/H39vHeH.gif"
        ]
        const index = Math.floor(Math.random()*3)
        const pater = msg.member
        const patted = msg.mentions.members.first()
        var text;
        if(params[1] === undefined){
            text = `${pater.displayName} ${this.translate[lang].trypat}`
        } else{
            text = (pater.id==patted.id) ?
            `${msg.guild.members.get(msg.client.user.id).displayName} ${this.translate[lang].patpat} ${pater.displayName}`:
            `${pater.displayName} ${this.translate[lang].patpat} ${patted.displayName}`
        }
        var embed = new Discord.RichEmbed()
        .setDescription(text)
        .setImage(list[index])
        msg.channel.send(embed)
    }
}
module.exports = new Command(data)
