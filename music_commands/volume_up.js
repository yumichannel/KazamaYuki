const Discord = require('discord.js');
const Command = require('../models/Command');
const data = {
    caller: "v+",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let player = msg.guild.music_player;
        let modifier = params[1] || 1;
        if (player && player.chatChannel) {
            if (msg.channel.id === player.chatChannel.id) {
                if (player.connection.dispatcher) {
                    let current = player.connection.dispatcher.volumeLogarithmic;
                    let newVol = current + 0.1*modifier;
                    if (newVol > 2){
                        newVol = 2;
                    }
                    player.connection.dispatcher.setVolumeLogarithmic(newVol);
                    msg.channel.send('current volume: '+ newVol.toFixed(1),{code: true});
                }
            }
        }
    }
}
module.exports = new Command(data)
