const Discord = require('discord.js');
const Command = require('../../models/Command');
const snekfetch = require('snekfetch');
const Canvas = require('canvas');
const Gif = require('gifencoder');
const data = {
    caller: "trigger",
    cd: 10,
    enable: true,
    run: async function (message, params) {
        let args = params[1];
        if (message.mentions.members.size === 0) {
            var {body: buffer} = await snekfetch.get(message.author.avatarURL({
                format: "jpg",
                size: 256
            }));
        } else {
            if (message.mentions.members.size > 1) {
                return message.channel.send(`you can't trigger more than one person!`, {code: true})
            } else {
                var {body: buffer} = await snekfetch.get(message.mentions.users.first().avatarURL({
                    format: "jpg",
                    size: 256
                }));
            }
        }
        const avatar = await Canvas.loadImage(buffer);
        const trigger = await Canvas.loadImage("./assets/triggered.png");
        const canvas = Canvas.createCanvas(300, 300);
        const context = canvas.getContext('2d');
        let counter = 5;
        let x, y;
        let encoder = new Gif(300, 300);
        encoder.start();
        encoder.setRepeat(0);
        encoder.setDelay(50);
        encoder.setQuality(5);

        while (counter > -1) {
            x = Math.floor(Math.random() * 30) - 60;
            y = Math.floor(Math.random() * 30) - 90;
            context.drawImage(avatar, x, y, 400, 400);
            context.save();
            context.globalAlpha = 0.5;
            context.fillStyle = '#ff0000';
            context.fillRect(0, 0, 300, 300);
            context.restore();
            x = Math.floor(Math.random() * 15) - 25;
            y = Math.floor(Math.random() * 15) + 210;
            context.drawImage(trigger, x, y, 400, 100);
            encoder.addFrame(context);
            if (counter <= 0) {
                encoder.finish();
                let buf = encoder.out.getData();
                await message.channel.send(new Discord.MessageAttachment(buf, "trigger.gif"));
            }
            counter--;
        }
    }
};
module.exports = new Command(data);
