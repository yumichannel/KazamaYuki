const Discord = require('discord.js');
const Command = require('../../models/Command');
const Canvas = require('canvas');
const data = {
    caller: "slap",
    cd: 10,
    description: "Slap someone ... at least",
    help: [
        ["slap",""]
    ],
    enable: true,
    run: async function (bot, msg, param) {
        let text = "";
        const slapper = await Canvas.loadImage(msg.author.avatarURL({
            size: 256,
            format: 'jpg'
        }));
        let slapped;
        if (msg.mentions.members.size > 0) {
            if (!msg.mentions.members.get(msg.client.user.id)) {
                slapped = await Canvas.loadImage(msg.mentions.members.first().user.avatarURL({
                    size: 256,
                    format: 'jpg'
                }))
            } else {
                text = "Không trượt phát lào";
                slapped = slapper;
            }
        } else {
            slapped = slapper;
        }

        const bg = await Canvas.loadImage('./assets/slap.jpg');

        let canvas = Canvas.createCanvas(400, 400)
        let context = canvas.getContext('2d');
        context.drawImage(bg, 0, 0, 400, 400);

        context.save();
        context.fillStyle = 'white';
        context.font = '40px arial';
        context.shadowColor = 'black';
        context.shadowBlur = 10;
        let range = context.measureText(text);

        context.fillText(text, (400 - range.width) / 2, 50);
        context.restore();

        context.drawImage(slapped, 235, 165, 125, 125);

        let buff = canvas.toBuffer();
        await msg.channel.send(new Discord.MessageAttachment(buff, "slap.jpg"))
    }
};
module.exports = new Command(data);
