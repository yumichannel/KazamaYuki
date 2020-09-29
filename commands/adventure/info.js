const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "stat",
    cd: 10,
    description: "Check member info",
    nsfw: false,
    help: [],
    enable: true,
    alias: [],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        const sexs = ["shounen ♂ ", "shoujo ♀ ", "futanari ⚤ "];
        const races = await bot.execsql("select * from adv_race");
        const dummy_field = { name: '\u200b', value: '\u200b' };
        const dummy_field_inline = { name: '\u200b', value: '\u200b', inline: true };
        if (bot.members.has(msg.author.id)) {
            let member = bot.members.get(msg.author.id);
            let em = new Discord.MessageEmbed;
            em.setTitle("[Member Info]")
                .setThumbnail(msg.author.displayAvatarURL({size: 256}))
                .addFields([
                    {
                        name: "Name",
                        value: member.name
                    },
                ])
                .addFields([
                    {
                        name: "Birth",
                        value: "00/00/00",
                        inline: true
                    },
                    {
                        name: "Sex",
                        value: sexs[member.sex - 1],
                        inline: true
                    },
                    {
                        name: "Race",
                        value: (races.find(m => m.race_id == member.race)).race_name,
                        inline: true
                    }
                ])
                .addFields([
                    {
                        name: "Level",
                        value: member.level,
                        inline: true
                    },
                    {
                        name: "EXP",
                        value: `${member.exp} / ${member.exp_max} [${(member.exp * 100 / member.exp_max).toFixed(2)} %]`,
                        inline: true
                    }, dummy_field_inline
                ])
                .addField("Balance",`${member.balance} (G)`);
            msg.channel.send(em);
        }
    }
}
module.exports = new Command(data)