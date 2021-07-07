const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const data = {
    caller: "pstat",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        if (!msg.guild.music_player.current) return;
        let em = new Discord.MessageEmbed();
        em.setTitle('Sagiri music player!');
        em.setImage(msg.guild.music_player.current && msg.guild.music_player.current.info.thumbnail.thumbnails[0].url || 'https://x.jpg');
        em.addField('Now playing',msg.guild.music_player.current.info.title)
        let queue = [];
        if (msg.guild.music_player.queue.length > 0) {
            queue = msg.guild.music_player.queue.map((value, index) => {
                return index + ": "+ value.info.title;
            })
            queue.join('\n');
        } else {
            queue = "Empty";
        }
        em.addField('In queue',queue);
        try {
            let playerStatMsg;
            let lastPlayerStatMsgId = msg.guild.music_player.playerStatMsgId;
            if (lastPlayerStatMsgId) {
                playerStatMsg = await msg.channel.messages.fetch(lastPlayerStatMsgId);
                await playerStatMsg.delete();
            }
            playerStatMsg = await msg.channel.send(em);
            msg.guild.music_player.playerStatMsgId = playerStatMsg.id;
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = new Command(data)
