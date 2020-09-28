const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "dailycheck",
    cd: 10,
    description: "Check member info",
    nsfw: false,
    help: [],
    enable: true,
    alias: ['dlck'],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (bot.members.has(msg.author.id)) {
            let mem = bot.members.get(msg.author.id);
            let now = Date.now();
            if (now - mem.last_atd > bot.adventure_const.attendance_timeout || !mem.last_atd) {
                mem.last_atd = now;
                mem.balance += bot.adventure_const.attendance_gold;
                mem.process.sync = true;
                bot.members.set(mem.user_id, mem);
                msg.channel.send(`${mem.getName()} receives ${bot.adventure_const.attendance_gold}G from attendance.`);
            }
        }
    }
}
module.exports = new Command(data)