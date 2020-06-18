const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const data = {
    caller: "pstat",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let queue = msg.guild.music_player.queue.map((value, index) => {
            return index + ": "+ value.info.title;
        })
        msg.channel.send(queue.join('\n') || 'Queue empty', {code: true});
    }
}
module.exports = new Command(data)
