const Discord = require('discord.js');
const Command = require('../models/Command');
const data = {
    caller: "stop",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let memberVoiceChannel = msg.member.voice.channel;
        if (memberVoiceChannel) {
            let botJoin = memberVoiceChannel.members.has(msg.client.user.id);
            if (botJoin) {
                memberVoiceChannel.leave();
                msg.guild.music_player.connection = null;
            }
        }
    }
}
module.exports = new Command(data)
