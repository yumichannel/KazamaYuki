const Discord = require('discord.js');
const Command = require('../models/Command');
const Player = require('../models/MPlayer');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const ytdl = require('ytdl-core');
const search_youtube = require('../utils/search_youtube');
const num_emoji = [null,'1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'];
const data = {
    caller: "search",
    cd: 1,
    enable: true,
    run: async function(client = new Discord.Client(),msg = new Discord.Message(),params= []) {
        let gid = msg.guild.id;
        let player = msg.guild.music_player;
        if (!msg.member.voice.channel) return msg.channel.send('You\'re not in voice.');
        let base_url = 'https://www.youtube.com/results?search_query=';
        params.shift();
        let str = params.join('+');
        let url = base_url + encodeURI(str) + "&sp=EgIQAQ%253D%253D";
        let result;
        let counter = 0;
        while (true) {
            if (counter === 10) {
                msg.channel.send('Timeout. Please try other keyword.', {code: true});
                break;
            }
            counter++;
            try {
                result = await search_youtube(url);
                let result_str = '';
                let result_ids = [];
                for (let i = 0; i < result.length; i++) {
                    if (i < 5) {
                        result_str += (i+1) + '\t:' + result[i].textContent + '\n';
                        result_ids.push(result[i].href.split('=')[1]);
                    }
                }
                let msgVideoSelector = await msg.channel.send(result_str,{code: true});
                let usedEmoji = [];
                for (let i = 0; i < result_ids.length; i++) {
                    await msgVideoSelector.react(num_emoji[i+1]);
                    usedEmoji.push(num_emoji[i+1]);
                }
                //React emoji `stop` to dispose
                await msgVideoSelector.react('🔴');
                usedEmoji.push('🔴');
                const filter = (reaction, user) => {
                    return usedEmoji.indexOf(reaction.emoji.name) >= 0 && user.id === msg.author.id;
                }
                let videoSelectorReactor = msgVideoSelector.createReactionCollector(filter)
                videoSelectorReactor.on('collect', async (reaction,user) => {
                    if (reaction.emoji.name === '🔴') {
                        console.log('stop selector');
                    } else {
                        let index = usedEmoji.indexOf(reaction.emoji.name);
                        const vid = 'https://www.youtube.com/watch?v=' + result_ids[index];
                        if (player.connection.dispatcher) {
                            player.queue.push({
                                id: result_ids[index],
                                url: vid,
                                info: (await ytdl.getInfo(vid)).player_response.videoDetails
                            });
                            msg.channel.send('Added: `'+ result[index].textContent + '`');
                        } else {
                            player.current = {
                                id: result_ids[index],
                                url: vid,
                                info: (await ytdl.getInfo(vid)).player_response.videoDetails
                            };
                            player.play();
                        }
                    }
                    videoSelectorReactor.stop();
                });
                videoSelectorReactor.on('end', function () {
                    msgVideoSelector.delete();
                })
                break;
            } catch (e) {
                console.log(e);
            }
        }
    }
}
module.exports = new Command(data)
