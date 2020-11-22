const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "itemadd",
    cd: 1,
    description: "Fast add new item",
    nsfw: false,
    help: [],
    enable: true,
    alias: ["iadd"],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (msg.author.id != process.env.owner || msg.channel.id != "523902271164252160") return;
        await msg.channel.send(">>> *indevelop*")
    }
}
module.exports = new Command(data)