const Discord = require('discord.js')
const Bot = require('../models/Bot');
module.exports = async function onMessage(bot = new Bot(), message = new Discord.Message) {
    if (message.channel.type === "dm") return;
    if (!bot.ready) return console.log('Bot is not ready.');
    const guild = message.guild;
    const channel = message.channel;
    const content = message.content;
    const prefix = bot.data.get(guild.id).prefix || bot.prefix;
    if (message.author.bot) return;
    if (bot.members.has(message.author.id)) bot.client.emit("member_chat", message.author.id, message.channel);
    if (!message.content.startsWith(prefix)) return;
    let params = message.content.substring(prefix.length).split(" ");
    let caller = params[0];

    // Is that command exist?
    if (caller === "help") return await message.member.send(require('../utils/getHelpList')(bot.commands));

    if (!bot.commands.has(caller)) {
        const errorMsg = bot.client.data.get(guild.id).errorMsg;
        return await channel.send(errorMsg[Math.floor(Math.random() * errorMsg.length)] || "Not an illegal command.")
    } else {
        const command = bot.commands.get(caller);
        // Check command help
        const helpReg = new RegExp(`^[${prefix}${bot.prefix}]${caller}\\s{1}help$`);
        if (content.match(helpReg)) {
            let em = new Discord.MessageEmbed();
            let num = Math.floor(Math.random() * 256);
            em.setColor([num, num, num]);
            // em.setTitle(`Command \`${caller}\``);
            let description = command.description;
            for (let i = 0; i < command.help.length; i++) {
                if (i === 0) {
                    description += "\n--------------------";
                }
                description += `\n\`${command.help[i][0]}\` ${command.help[i][1]}`;
            }
            em.setDescription(description);
            return await channel.send(em);
        }

        // Are u good enough to use this?
        if (command.category === "admin") {
            if (!message.member.permissions.has("ADMINISTRATOR")) {
                return await channel.send(
                    translator.admin_warn[bot.client.data.get(guild.id).lang]
                        .replace("@user", message.member)
                );
            }
        }
        if (command.category === "creator" && message.author.id !== process.env.owner) {
            return await channel.send(translator.owner_warn[bot.client.data.get(guild.id).lang]);
        }
        if (command.nsfw === true && message.channel.nsfw === false) {
            return bot.client.lewd_warning(message);
        }
        // Are u too fast?
        let cdkey = caller + message.author.id;
        let cdTime = command.cd * 1000;
        if (bot.cd.has(cdkey)) {
            let exp = bot.cd.get(cdkey);
            if (Date.now() < exp) {
                return channel.send(translator.cooldown_warn[bot.client.data.get(guild.id).lang]);
            }
        }
        // Set new cooldown
        bot.cd.set(cdkey, Date.now() + cdTime);
        setTimeout(() => {
            bot.cd.delete(cdkey)
        }, cdTime);

        // Try to execute command
        try {
            bot.commands.get(caller).run(bot, message, params)
        } catch (error) {
            console.log(error);
        }
    }
}