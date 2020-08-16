const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "activity",
    cd: 1,
    enable: true,
    run: function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        const act=["Playing","Watching","Listening","Streaming"];
        const actEmoji=["0⃣","1⃣","2⃣","3⃣"];
        let opt_str =""
        let count = 0;
        act.map(opt=>opt_str+=`${count++}. ${opt}\n`);
        let channel = msg.channel
        msg.channel.send("What's activity you wanna set?\n"+opt_str).then(async m=>{
            await m.react("0⃣")
            await m.react("1⃣")
            await m.react("2⃣")
            await m.react("3⃣")
            var filter = (react,user)=>{return actEmoji.includes(react.emoji.name) && user.id===msg.author.id}
            const collector = m.createReactionCollector(filter)
            collector.on("collect",r=>{
                if(act[parseInt(r.emoji.name.charAt(0))]=="Streaming"){
                    channel.send("Enter link stream with format `Name action | Link stream`")
                    const streamCollector = msg.channel.createCollector((response)=>{return response.author.id==msg.author.id})
                    streamCollector.on("collect",mes=>{
                        let arr = mes.content.split("|")
                        msg.client.user.setActivity(arr[0],{
                            url:arr[1],
                            type:"STREAMING"
                        })
                        streamCollector.stop()
                    })
                }else{
                    channel.send("Enter name of action:")
                    const streamCollector = msg.channel.createCollector((response)=>{return response.author.id==msg.author.id})
                    streamCollector.on("collect",mes=>{
                        msg.client.user.setActivity(mes.content,{
                            type:act[parseInt(r.emoji.name.charAt(0))].toUpperCase()
                        })
                        streamCollector.stop()
                    })
                }
                collector.stop()
            })
            
        });
    }
}
module.exports = new Command(data)
