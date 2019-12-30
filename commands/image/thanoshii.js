const Discord = require('discord.js');
const Command = require('../../models/Command');
const Canvas = require('canvas');
var snekfetch = require('snekfetch');
const data = {
    caller: "thanoshii",
    cd: 10,
    run: async function(msg=new Discord.Message,params=[]){
        const canvas = Canvas.createCanvas(200,200)
        const context = canvas.getContext('2d')
        const {body:buffer} =  await snekfetch.get(msg.author.displayAvatarURL.replace("=2048","=256"))
        const image = await Canvas.loadImage(buffer)
        context.drawImage(image, 0, 0, 200, 200);
        var z = 300;
        var A = [];
        var count = 0;
        for(let i=199;i>25;i--){
            let zz = z;
            // console.log("vòng:"+i+"-z="+z+"-zz="+zz)
            for(let k=0;k<200;k++){
                A.push(1);
            }
            while(zz>0){
                let pos = Math.floor(Math.random()*200);
                if(A[pos]==1){
                    context.clearRect(i, pos, 1, 1);
                    A[pos]==0
                    zz--
                }
            }
            A = [];
            z=z-Math.floor(Math.random()*5);
            // z=z-3
            if(z<=0) break
        }
        msg.channel.send(new Discord.Attachment(canvas.toBuffer(),"dust.png"))
    }
}
module.exports = new Command(data)
