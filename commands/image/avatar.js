require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "avatar",
    cd: 10,
    run: async function (msg, params) {
        const mention = msg.mentions.members;
        let url = "";
        if (mention.size === 0) {
            url = msg.author.avatarURL({
                format: "jpg",
                size: 256
            })
        } else {
            url = mention.first().user.avatarURL({
                format: "jpg",
                size: 256
            });
        }
        await msg.channel.send("", {
            embed: {
                image: {
                    url: url,
                    width: 250
                }
            }
        })
    }
};
module.exports = new Command(data);
