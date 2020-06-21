const Discord = require('discord.js');
const Command = require('../../models/Command');
const snek = require("snekfetch");
const data = {
    caller: "yan",
    cd: 1,
    nsfw: true,
    enable: true,
    run: async function (msg, params) {
        const src = "https://yande.re/";
        var em = new Discord.MessageEmbed();
        switch (params[1]) {
            case "daily": {
                var {body: result} = await snek.get(src + "post/popular_recent.json");
                if (result.length < 1) return;
                const ran = Math.floor(Math.random() * result.length);
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl);
                em.setDescription(`[Full resolution](${result[ran].file_url})`);
                await msg.channel.send(em);
                break;
            }
            case "weekly": {
                var {body: result} = await snek.get(src + "post/popular_recent.json?period=1w");
                if (result.length < 1) return;
                const ran = Math.floor(Math.random() * result.length);
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl);
                em.setDescription(`[Full resolution](${result[ran].file_url})`);
                await msg.channel.send(em);
                break
            }
            case "monthly": {
                var {body: result} = await snek.get(src + "post/popular_recent.json?period=1m");
                if (result.length < 1) return;
                const ran = Math.floor(Math.random() * result.length);
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl);
                em.setDescription(`[Full resolution](${result[ran].file_url})`);
                await msg.channel.send(em);
                break
            }
            case "yearly": {
                var {body: result} = await snek.get(src + "post/popular_recent.json?period=1y");
                if (result.length < 1) return;
                const ran = Math.floor(Math.random() * result.length);
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl);
                em.setDescription(`[Full resolution](${result[ran].file_url})`);
                await msg.channel.send(em);
                break
            }
            case "": {
                var {body: result} = await snek.get(src + "post.json?tags=order%3Arandom")
                if (result.length < 1) return
                const ran = Math.floor(Math.random() * result.length)
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl)
                em.setDescription(`[Full resolution](${result[ran].file_url})`)
                await msg.channel.send(em);
                break
            }
            default: {
                let tag = params[1].replace(" ", "_");
                var {body: result} = await snek.get(src + "post.json?tags=" + encodeURI(tag));
                if (result.length < 1) return;
                const ran = Math.floor(Math.random() * result.length);
                const imgurl = result[ran].sample_url;
                em.setImage(imgurl);
                em.setDescription(`[Full resolution](${result[ran].file_url})`);
                await msg.channel.send(em);
            }
        }
    }
};
module.exports = new Command(data);
