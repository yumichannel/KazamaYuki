const Discord = require('discord.js');
const Command = require('../../models/Command');
const snek = require('snekfetch')
const Canvas = require('canvas')
const data = {
    caller: "slap",
    cd: 10,
    run:async function(msg=new Discord.Message,params=[]){
        var text = ""
        const {body:buffer1} = await snek.get(msg.author.displayAvatarURL.replace("=2048","=256"));
        const slapper = await Canvas.loadImage(buffer1)
        var slapped
        if(msg.mentions.members.size>0){
            if(msg.mentions.members.get(msg.client.user.id)==undefined){
                const {body:buffer2} = await snek.get(msg.mentions.members.first().user.displayAvatarURL.replace("=2048","=256"));
                slapped = await Canvas.loadImage(buffer2)
            }else{
                text = "Không trượt phát lào"
                slapped = slapper
            }
        }else{
            slapped = slapper
        }
        
        const bg = await Canvas.loadImage('./assets/slap.jpg')
        
        var canvas = Canvas.createCanvas(400,400)
        var context = canvas.getContext('2d')
        context.drawImage(bg, 0, 0, 400, 400);

        context.save();
        context.fillStyle='white';
        context.font='40px arial';
        context.shadowColor='black';
        context.shadowBlur=10;
        var range = context.measureText(text)
        
        context.fillText(text, (400 - range.width)/2, 50);
        context.restore();

        context.drawImage(slapped, 235, 165, 125, 125);
        
        var buff = canvas.toBuffer()
        msg.channel.send(new Discord.Attachment(buff,"slap.jpg"))
    }
}
module.exports = new Command(data)