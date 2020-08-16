require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "avatar",
    cd: 10,
    description: "Get your avatar or tagged user",
    help: [
        ["avatar","Get your avatar"],
        ["avatar @user","Get server user avatar"]
    ],
    enable: true,
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
                    width: 256
                }
            }
        })
    }
};
module.exports = new Command(data);
