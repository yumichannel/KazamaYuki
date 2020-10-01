const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "gset",
    cd: 10,
    description: "Guild set system channel.",
    nsfw: false,
    help: [],
    enable: true,
    alias: [],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (!msg.member.hasPermission('ADMINISTRATOR')) msg.channel.send(`> ${msg.member} administrator only!`);
        if (!params[1]) return;
        let guild = bot.data.get(msg.guild.id);
        if (!guild) return;
        switch(params[1]) {
            case "notify": {
                guild.adv_notif_channel = msg.channel.id;
                let result = await bot.execsql(`
                    update guild_custom_data
                    set adv_notif_channel = "${guild.adv_notif_channel}"
                    where guild_id = "${guild.guild_id}"
                `);
                if (result && result.affectedRows) {
                    msg.channel.send(`> *Set ${msg.channel} as Guild Notification Board channel*`);
                }
                break;
            }
            case "hall": {
                guild.hall_id = msg.channel.id;
                let result = await bot.execsql(`
                    update guild_custom_data
                    set hall_channel = "${guild.hall_id}"
                    where guild_id = "${guild.guild_id}"
                `);
                if (result && result.affectedRows) {
                    msg.channel.send(`> *Set ${msg.channel} as Guild Hall channel*`); 
                }
                break;
            }
            default: 
                return;
        }
    }
}
module.exports = new Command(data)