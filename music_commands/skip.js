const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const data = {
    caller: "skip",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        var player = msg.guild.music_player;
        if (player.current) {
            player.lastPlay = player.current;
            console.log("Skip "+player.current.url);
            if (params[1] === "-k" || params[1] === "--keep") {
                player.next(false);
            } else {
                player.next(true);
            }
        }
    }
}
module.exports = new Command(data)
