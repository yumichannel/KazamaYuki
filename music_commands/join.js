const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const data = {
    caller: "join",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let gid = msg.guild.id;
        let player = msg.guild.music_player;
        if (msg.member.voice.channel) {
            if (!player.connection) {
                try {
                    player.connection = await msg
                        .member.voice.channel.join();
                    player.chatChannel = msg.channel;
                    return msg.channel.send(`Joined voice channel **${msg.member.voice.channel.name}**`);
                } catch (e) {
                    let log_id = await client.report('report',e.message);
                    return msg.channel.send('Something went wrong. Check log number '+log_id);
                }
            } else {
                return msg.channel.send('Already joined, please use `m,move` to change voice channel');
            }
        } else {
            return msg.channel.send('You are not in voice.');
        }
    }
}
module.exports = new Command(data)
