const Discord = require('discord.js');
const Command = require('../../models/Command');
const ytdl = require('ytdl-core-discord');
const data = {
    caller: "musik",
    cd: 0.1,
    run: async function(msg=new Discord.Message,params=[]){
        return;
        let option = params[1];
        function update(player){
            msg.client.mplayer.set(msg.guild.id,player)
        }
        async function play(url=""){
            let player =  msg.client.mplayer.get(msg.guild.id)
            console.log("playing: "+url)
            console.log(msg.client.mplayer.get(msg.guild.id))
            player.stream.playOpusStream(await ytdl(url,{filter:"audioonly"}))
            .on("end",()=>{
                let p = msg.client.mplayer.get(msg.guild.id)
                if(p.queue.length==0){
                    p.playing = null
                    update(p)
                }else{
                    let next = p.queue.shift()
                    p.playing = next
                    update(p)
                    play(next)
                }
            })
        }
        switch (option) {
            case "queue":
                msg.channel.send(`${msg.client.mplayer.get(msg.guild.id).queue.join("\n")}`,{code: true})
                break;
            case "join":
                if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                if(msg.client.mplayer.has(msg.guild.id)) return
                msg.member.voiceChannel.join().then(v=>{
                    msg.client.mplayer.set(msg.guild.id,{
                        stream: v,
                        queue: [],
                        playing: null,
                        loop: "none"
                    })
                    console.log(`Joined ${msg.member.voiceChannel.name}`)
                    console.log(msg.client.mplayer.get(msg.guild.id))
                })
                break;
            case "leave":
                if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                msg.client.mplayer.delete(msg.guild.id)
                msg.member.voiceChannel.leave();
                break
            case "play":
                if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                let url = params[2]
                if(msg.client.mplayer.get(msg.guild.id).playing){
                    msg.client.mplayer.get(msg.guild.id).queue.push(url)
                }else{
                    play(url)
                }
                break
            case "playlist":
                break
            default:
                break;
        }
    }
}
module.exports = new Command(data)