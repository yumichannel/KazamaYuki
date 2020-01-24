const categoryList = require('../models/config').cmdType
const Discord = require('discord.js')
module.exports = function(data = new Discord.Collection){
    let embed = new Discord.RichEmbed;
    categoryList.forEach(category => {
        if(category == 'creator') return
        let commandsStr = []
        data.forEach((value,key)=>{
            if(value.category == category){
                commandsStr.push(`[${key}](http://yumichannel.herokuapp.com)`)
            }
        })
        if (commandsStr.length == 0) {
            embed.addField(category,'No command available')
        }else{
            embed.addField(category,commandsStr.join(', '))
        }
    })
    embed.setTitle("List of available command");
    return embed;
}