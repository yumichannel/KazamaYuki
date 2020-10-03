const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "world_status",
    cd: 10,
    description: "Check status of the world",
    nsfw: false,
    help: [],
    enable: true,
    alias: [],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (msg.author.id !== process.env.owner) msg.channel.send(`> _**Forbidden command!**_`);
        let em = new Discord.MessageEmbed;
        let time_count_to_next_drop =  bot.world_data.gold_drop.drop_at - Date.now();
        let hour = Math.floor(time_count_to_next_drop / 3600000);
        time_count_to_next_drop -= hour * 3600000;
        let minute = Math.floor(time_count_to_next_drop / 60000);
        time_count_to_next_drop -= minute * 60000;
        let second = Math.floor(time_count_to_next_drop / 1000);
        time_count_to_next_drop -= second * 1000;
        em.addFields([
            {
                name: "Guild joined",
                value: bot.data.size,
                inline: true
            },
            {
                name: "Registed member",
                value: bot.members.size,
                inline: true
            },
            {
                name: "Chest drop",
                value: `Next drop: ${hour}h:${minute}m:${second}s:${time_count_to_next_drop}ms`
            }
        ]);
        msg.channel.send(em);
    }
}
module.exports = new Command(data)