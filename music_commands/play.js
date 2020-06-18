const Discord = require('discord.js');
const Command = require('../models/Command');
const ytdl = require('ytdl-core');
const data = {
    caller: "play",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let gid = msg.guild.id;
        let player = msg.guild.music_player;
        if (!msg.member.voice.channel) return msg.channel.send('You\'re not in voice.');
        if (!player.connection) return msg.channel.send("I'm not in voice.");
        if (!params[1]) return msg.channel.send("Missing url.");
        if (!ytdl.validateURL(params[1])) return msg.channel.send("Invalid url.");
        let vid = params[1];
        try {
            if (player.connection.dispatcher) {
                player.queue.push({
                    id: ytdl.getVideoID(vid),
                    url: vid,
                    info: await ytdl.getInfo(vid)
                });
            } else {
                player.current = {
                    id: ytdl.getVideoID(vid),
                    url: vid,
                    info: await ytdl.getInfo(vid)
                };
                player.play();
            }
        } catch (e) {
            let log_id = await client.report('report',e.message);
            return msg.channel.send('Something went wrong. Check log number '+log_id);
        }
    }
}
module.exports = new Command(data)
