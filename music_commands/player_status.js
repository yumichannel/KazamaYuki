const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const data = {
    caller: "pstat",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        msg.channel.send(msg.guild.music_player.queue.join('\n') || 'Queue empty', {code: true});
    }
}
module.exports = new Command(data)
