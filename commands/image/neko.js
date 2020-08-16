const Discord = require('discord.js');
const Command = require('../../models/Command');
const snekfetch = require('snekfetch');
require('../../models/Bot');
const data = {
    caller: "neko",
    cd: 1,
    enable: true,
    run: async function (bot, msg, params) {
        let src = 'https://nekos.life/';
        let lewd = false;
        let tag = "";
        if (params[1] === 'lewd') {
            lewd = true;
            tag = 'lewd'
        }
        if (lewd && msg.channel.nsfw === false) {
            msg.client.lewd_warning(msg);
        } else {
            let res = await snekfetch.get(src + tag);
            let body = res.body.toString();
            let strindex = body.split('"');
            let ans = strindex.find(n => {
                if (lewd) {
                    return n.indexOf('https://cdn.nekos.life/lewd') === 0;
                } else {
                    return n.indexOf('https://cdn.nekos.life/neko') === 0;
                }
            });
            await msg.channel.send(new Discord.MessageEmbed().setImage(ans));
        }
    }
};
module.exports = new Command(data);
