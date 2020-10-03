const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "drop_chest",
    cd: 10,
    description: "Trigger chest drop event manually",
    nsfw: false,
    help: [],
    enable: true,
    alias: [],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (msg.author.id !== process.env.owner) msg.channel.send(`> _**Forbidden command!**_`);
        bot.world_data.gold_drop.dropped = false;
        msg.channel.send(`Chest drop triggered manually, master ${msg.author}!`);
    }
}
module.exports = new Command(data)