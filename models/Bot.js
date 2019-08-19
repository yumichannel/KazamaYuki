const Discord = require('discord.js');
const fs = require('fs');
const load_cmd = require('../utils/load_command.js')
const load_data = require('../utils/load_data.js')
const translater = require('./config').translate
var read_data = require('../utils/read_data')
const ytdl = require('ytdl-core-discord')
const ytdls = require('ytdl-core')
const snek = require('snekfetch')
module.exports = class Bot {
    constructor(cfg) {
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.client.mplayer = new Discord.Collection();
        this.client.caroGame = new Discord.Collection();
        this.client.data = new Discord.Collection();
        this.cd = new Discord.Collection();
        this.client.lewd_warning = function(msg){
            msg.channel.send(new Discord.RichEmbed()
                .setTitle("NSFW")
                .setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif')
            )
        }
        this.client.update_data = function(){
            fs.writeFile("models/database.json",JSON.stringify(this.data.array()),{encoding:"utf8"},(err)=>{
                if(err){
                    console.log(err)
                }
            })
        }
        this.client
        .once('ready',async ()=>{
            this.client.user.setActivity("LOLOLOLOLOL",{
                type: "LISTENING"
            })
            
            load_cmd(cfg.cmdType).then(commands=>{
                this.client.commands = commands
                console.log(`Complete!`);
            })
            
            load_data(this.client.guilds.map(g=>{return g.id})).then(data=>{
                this.client.data=data;
                console.log(`Loaded custom data of ${data.size} guild`);
            })
        })
        .on('channelCreate',()=>{})
        .on('channelDelete',()=>{})
        .on('channelPinsUpdate',()=>{})
        .on('channelUpdate',()=>{})
        .on('clientUserGuildSettingsUpdate',()=>{})
        .on('clientUserSettingsUpdate',()=>{})
        .on('debug',()=>{})
        .on('disconnect',()=>{
            console.log("disconnect")
        })
        .on('emojiCreate',()=>{})
        .on('emojiDelete',()=>{})
        .on('emojiUpdate',()=>{})
        .on('error',(e)=>{
            console.log(e)
        })
        .on('guildBanAdd',()=>{})
        .on('guildBanRemove',()=>{})
        .on('guildCreate',async (g)=>{
            let data = await read_data();
            let new_data = {
                guild_id:  g.id,
                welcomeMsg: [],
                welcomeChannel: [
                    "general"
                ],
                errorMsg: [
                    "Unfortunely,It's error"
                ],
                prefix: "!",
                lang: "en"
            }
            data.push(new_data)
            this.client.data.set(g.id,new_data)

        })
        .on('guildDelete',(g)=>{
            this.client.data.delete(g.id);
            this.client.update_data();
        })
        .on('guildIntegrationsUpdate',()=>{})
        .on('guildMemberAdd',async (member)=>{
            let channel = member.guild.channels.find(c=>{
                return c.name==this.client.data.get(member.guild.id).welcomeChannel
            })
            if(channel==undefined)  return;
            let wlist = this.client.data.get(member.guild.id).welcomeMsg
            let ran = Math.floor(Math.random()*wlist.length)
            channel.send(wlist[ran].replace("@user",`${member}`))
        })
        .on('guildMemberAvailable',()=>{})
        .on('guildMemberRemove',()=>{})
        .on('guildMemberSpeaking',()=>{})
        .on('guildMemberUpdate',()=>{})
        .on('guildMembersChunk',()=>{})
        .on('guildUnavailable',()=>{})
        .on('guildUpdate',()=>{})
        .on('message',(message)=>{
            const guild = message.guild
            const channel = message.channel
            const content = message.content
            const prefix = this.client.data.get(guild.id).prefix || cfg.prefix;
            if(message.author.bot) return;
            if(!message.content.startsWith(prefix)) return;
            var params = message.content.substring(prefix.length).split(" ")
            var caller = params[0] 
            // Is that command exist?
            if(!this.client.commands.has(caller)){
                const errorMsg = this.client.data.get(guild.id).errorMsg
                return channel.send(errorMsg[Math.floor(Math.random()*errorMsg.length)] || "Em không thể làm điều đó :<")
            }else{
                const command = this.client.commands.get(caller)
                const helpReg = new RegExp(`^[${prefix}${cfg.prefix}]${caller}\\s{1}help$`);
                if(content.match(helpReg)){
                    var em = new Discord.RichEmbed()
                    var num = Math.floor(Math.random()*256)
                    em.setColor([num,num,num])
                    em.setTitle(`How to use \`${caller}\``)
                    em.setDescription(command.help)
                    return channel.send(em);
                }

                // Are u good enough to use this?
                if(command.category=="admin"){
                    if(!message.member.permissions.has("ADMINISTRATOR")){
                        return channel.send(translater.admin_warn[this.client.data.get(guild.id).lang].replace("@user",message.member))
                    }
                }
                if(command.category=="creator" && message.author.id!=process.env.owner){
                    return channel.send(translater.owner_warn[this.client.data.get(guild.id).lang])
                }
                
                if(command.nsfw==true && message.channel.nsfw==false){
                    return this.client.lewd_warning(message);
                }
                // Are u too fast?
                var cdkey = caller+message.author.id
                var cdTime = command.cd*1000
                if(this.cd.has(cdkey)){
                    var exp = this.cd.get(cdkey)
                    if(Date.now() < exp){
                        return channel.send(translater.cooldown_warn[this.client.data.get(guild.id).lang])
                    }
                }

                // Set new cooldown
                this.cd.set(cdkey,Date.now()+cdTime)
                setTimeout(()=>{
                    this.cd.delete(cdkey)
                },cdTime)

                // Try to execute command
                try {
                    if(caller=="musik"){
                        this.play_musik(message,params)
                    }else{
                        this.client.commands.get(caller).run(message,params)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        })
        .on('messageDelete',()=>{})
        .on('messageDeleteBulk',()=>{})
        .on('messageReactionAdd',()=>{})
        .on('messageReactionRemove',()=>{})
        .on('messageReactionRemoveAll',()=>{})
        .on('messageUpdate',()=>{})
        .on('presenceUpdate',()=>{})
        .on('rateLimit',()=>{})
        .on('reconnecting',()=>{})
        .on('resume',()=>{})
        .on('roleCreate',()=>{})
        .on('roleDelete',()=>{})
        .on('roleUpdate',()=>{})
        .on('typingStart',()=>{})
        .on('typingStop',()=>{})
        .on('userNoteUpdate',()=>{})
        .on('userUpdate',()=>{})
        .on('voiceStateUpdate',()=>{})
        .on('warn',()=>{})
        .on('webhookUpdate',()=>{})

        this.client.login(cfg.token);
        this.play_musik = async (msg,params)=>{
            let option = params[1];
            switch (option) {
                case "queue":{
                    msg.channel.send(msg.client.mplayer.get(msg.guild.id).queue.map((i,j)=>`[${j}. ${i.name}]`).join("\n"),{code:true})
                    break;}
                case "loop":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})

                    let modeTxt = ['none','only','all']
                    let mode = params[2];
                    if(!isNaN(mode)){
                        mode = parseInt(mode);
                        if(mode>=0 && mode<=2){
                            let player = this.client.mplayer.get(msg.guild.id)
                            player.loop = mode
                            this.client.mplayer.set(msg.guild.id,player)
                            msg.channel.send(`\`Loop mode: ${modeTxt[mode]}\``)
                        }
                    }
                    break;
                }
                case "stat":{
                    let em = new Discord.RichEmbed();
                    let player = this.client.mplayer.get(msg.guild.id)
                    em.setTitle('MUSIK STAT')
                    em.addField('Playing',`[${player.playing.name}](${player.playing.url})`)
                    em.addField('In queue',`${player.queue.length}`,true)
                    em.addField('Loop mode',`${['none','only','all'][parseInt(player.loop)]}`,true)
                    em.setColor('purple')
                    msg.channel.send(em)
                    break
                }
                case "join":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    if(msg.client.mplayer.has(msg.guild.id))
                        return msg.channel.send(`Already joined ${msg.client.mplayer.get(msg.guild.id).stream.channel.name}`)
                    msg.member.voiceChannel.join().then(v=>{
                        this.client.mplayer.set(msg.guild.id,{
                            stream: v,
                            queue: [],
                            playing: null,
                            loop: 0,    //0: no loop; 1: loop once; 2:loop all
                            commandChannel: msg.channel.id
                        })
                        console.log(`Joined ${v.channel.name}`)
                    })
                    break;}
                case "leave":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    let player = this.client.mplayer.get(msg.guild.id)
                    player.queue = []
                    this.client.mplayer.set(msg.guild.id,player)
                    msg.member.voiceChannel.leave();
                    this.client.mplayer.delete(msg.guild.id)
                    break
                }
                case "play":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    if(!params[2])  return
                    let url = params.slice(2).join(" ")
                    if(url.startsWith("http://") || url.startsWith("https://")){

                    }else{
                        let res = await snek.get("https://www.googleapis.com/youtube/v3/search",{
                            query:{
                                part:"snippet",
                                q:url,
                                maxResults:1,
                                key:cfg.ytapikey
                            }
                        })
                        if(res.body.items.length>0){
                            url = "https://youtu.be/"+res.body.items[0].id.videoId
                        }else{
                            return msg.channel.send("No video found")
                        }
                    }
                    let player = this.client.mplayer.get(msg.guild.id)
                    ytdls.getBasicInfo(url).then(info=>{
                        let details = info.player_response.videoDetails
                        let item = {
                            url: info.video_url,
                            name: details.title,
                            uploader: info.author.name,
                            time: new Date(0,0,0,0,0,parseInt(details.lengthSeconds),0).toTimeString().substring(0,8),
                            skip: false
                        }
                        if(player.playing){
                            player.queue.push(item)
                            this.client.mplayer.set(msg.guild.id,player)
                            msg.channel.send(new Discord.RichEmbed()
                            .setDescription(`\`\`\`Added ${item.name} at position ${player.queue.length}\`\`\``)
                            .setColor("#23b841"))
                        }else{
                            player.queue.push(item)
                            player.playing = item;
                            this.client.mplayer.set(msg.guild.id,player)
                            this.play(msg,player.stream,item)
                        }
                    }).catch(reason=>{
                        msg.channel.send(reason.message,{code:true})
                    })
                    break
                }
                case "playlist":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    break
                }
                case "delete":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    let player = this.client.mplayer.get(msg.guild.id)
                    let num = parseInt(params[2])
                    if(!isNaN(num)){
                        if(num>=0 && num<player.queue.length){
                            let deleted = player.queue.splice(num,1)
                            console.log('deleted');
                            this.client.mplayer.set(msg.guild.id,player)
                            msg.channel.send("Removed: "+deleted.name)
                        }
                    }
                    break
                }
                case "next":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    let player = this.client.mplayer.get(msg.guild.id)
                    if(player.playing){
                        player.stream.dispatcher.end()
                    }
                    break
                }
                case "skip":{
                    if(!msg.member.voiceChannel) return msg.channel.send("Join voice first!",{code:true})
                    let player = this.client.mplayer.get(msg.guild.id)
                    if(player.playing){
                        player.playing.skip = true
                        this.client.mplayer.set(msg.guild.id,player)
                        player.stream.dispatcher.end()
                    }
                    break;
                }
                default:
                    break;
            }
        }
        this.play = async (msg,stream,item)=>{
            try {
                let em = new Discord.RichEmbed()
                em.setAuthor("NOW PLAYING:")
                em.setTitle(item.name)
                em.setURL(item.url)
                em.setDescription("Upload by "+item.uploader)
                em.setFooter(`Duration: ${item.time}`)
                em.setColor("#7ab4ff")
                if(this.client.mplayer.get(msg.guild.id).loop!=1){
                    msg.channel.send(em)
                }
                stream.playOpusStream(await ytdl(item.url,{filter:"audioonly"}))
                .on("end",()=>{
                    let player = this.client.mplayer.get(msg.guild.id)
                    if(player.queue.length <= 1 && player.loop!=1){
                        player.playing = null
                        this.client.mplayer.set(msg.guild.id,player)
                        msg.channel.send(new Discord.RichEmbed()
                        .setColor("#ff4040")
                        .setDescription("End Of Queue"))
                    }else{
                        if(player.loop==0){
                            player.queue.shift()
                        }else{
                            if(player.loop==1){
                                //do nothing
                            }
                            if(player.loop==2){
                                let item = player.queue.shift();
                                if(!player.playing.skip){
                                    player.queue.push(item)
                                }
                            }
                        }
                        player.playing = player.queue[0]
                        this.client.mplayer.set(msg.guild.id,player)
                        this.play(msg,stream,player.playing)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
    }
    
}
