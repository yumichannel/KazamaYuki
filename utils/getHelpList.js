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
        embed.addField(category,commandsStr.join(', '))
    })
    return embed;
}