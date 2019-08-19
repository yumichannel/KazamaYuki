const Discord = require('discord.js')

/**
 * @param {Discord.Message} message
 * @param {String} mode
 */
module.exports = function(message,mode){
    const config = {
        game_start: ['orange','Game has been started'],
        game_not_start: ['red','Game is not started yet'],
        match_start: ['orange','Match has been started'],
        match_not_start: ['red','Match is not started yet'],
        need_player: ['orange','Match need at least two players'],
        join: ['blue','Type `join caro` to join']
    }

    let em = new Discord.RichEmbed()
    em.setColor(config[mode][0])
    em.setDescription(config[mode][1])
    message.channel.send(em);
}