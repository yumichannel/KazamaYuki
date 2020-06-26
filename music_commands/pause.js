const Discord = require('discord.js');
const Command = require('../models/Command');
const data = {
    caller: "pause",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let player = msg.guild.music_player;
        if (player && player.chatChannel) {
            if (msg.channel.id === player.chatChannel.id) {
                if (player.connection.dispatcher) {
                    if (player.connection.dispatcher.paused) {
                        player.connection.dispatcher.resume();
                    } else {
                        player.connection.dispatcher.pause();
                    }
                }
            }
        }
    }
}
module.exports = new Command(data)
