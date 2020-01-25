const Discord = require('discord.js');
const fs = require('fs');
const load_cmd = require('../utils/load_command.js')
const load_data = require('../utils/load_data.js')
const translater = require('./config').translate
var read_data = require('../utils/read_data')
// const ytdl = require('ytdl-core-discord')
// const ytdls = require('ytdl-core')
const snek = require('snekfetch')
const defaultAction = require('./DefaultAction');
module.exports = class Bot {
    constructor(cfg) {
        this.startChannel = cfg.startChannel;
        this.ready = false;
        this.sleep = false;
        this.client = new Discord.Client();
        this.client.commands = new Discord.Collection();
        this.client.caroGame = new Discord.Collection();
        this.client.data = new Discord.Collection();
        this.cd = new Discord.Collection();
        this.client.lewd_warning = function (msg) {
            msg.channel.send(new Discord.RichEmbed()
                .setTitle("NSFW")
                .setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif')
            )
        }
        this.client.update_data = function () {
            fs.writeFile("models/database.json", JSON.stringify(this.data.array()), {encoding: "utf8"}, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
        this.client
            .once('ready', async () => {
                this.client.user.setActivity("loading to 99%", {
                    type: "WATCHING"
                })

                load_cmd(cfg.cmdType).then(commands => {
                    this.client.commands = commands
                    console.log(`Complete!`);
                })

                load_data(this.client.guilds.map(g => {
                    return g.id
                })).then(data => {
                    this.client.data = data;
                    this.ready = true;
                    console.log(`Loaded custom data of ${data.size} guild`);
                    if (this.startChannel) {
                        this.client.channels.get(this.startChannel).send(`onee-chan, onii-chan, Sagiri đã online rồi đây!`)
                        .then(message => {
                            message.channel.send('',{embed: {
                                image: {
                                    url: 'https://i.imgur.com/VRXDYp2.gif'
                                }
                            }})
                        })
                    }
                })
            })
            .on('channelCreate', () => {
            })
            .on('channelDelete', () => {
            })
            .on('channelPinsUpdate', () => {
            })
            .on('channelUpdate', () => {
            })
            .on('clientUserGuildSettingsUpdate', () => {
            })
            .on('clientUserSettingsUpdate', () => {
            })
            .on('debug', () => {
            })
            .on('disconnect', () => {
                console.log("disconnect")
            })
            .on('emojiCreate', () => {
            })
            .on('emojiDelete', () => {
            })
            .on('emojiUpdate', () => {
            })
            .on('error', (e) => {
                console.log(e)
            })
            .on('guildBanAdd', () => {
            })
            .on('guildBanRemove', () => {
            })
            .on('guildCreate', async (g) => {
                let data = await read_data();
                let new_data = {
                    guild_id: g.id,
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
                this.client.data.set(g.id, new_data)

            })
            .on('guildDelete', (g) => {
                this.client.data.delete(g.id);
                this.client.update_data();
            })
            .on('guildIntegrationsUpdate', () => {
            })
            .on('guildMemberAdd', async (member) => {
                let channel = member.guild.channels.find(c => {
                    return c.name == this.client.data.get(member.guild.id).welcomeChannel
                })
                if (channel == undefined) return;
                let wlist = this.client.data.get(member.guild.id).welcomeMsg
                let ran = Math.floor(Math.random() * wlist.length)
                channel.send(wlist[ran].replace("@user", `${member}`))
            })
            .on('guildMemberAvailable', () => {
            })
            .on('guildMemberRemove', () => {
            })
            .on('guildMemberSpeaking', () => {
            })
            .on('guildMemberUpdate', () => {
            })
            .on('guildMembersChunk', () => {
            })
            .on('guildUnavailable', () => {
            })
            .on('guildUpdate', () => {
            })
            .on('message', (message) => {
                if (message.channel.type === "dm") return;
                if (!this.ready) return console.log('Bot is not ready.');
                // if (defaultAction.actionList[message.content]) {
                //     defaultAction._do(defaultAction.actionList[message.content]);
                //     return;
                // }
                const guild = message.guild
                const channel = message.channel
                const content = message.content
                const prefix = this.client.data.get(guild.id).prefix || cfg.prefix;
                if (message.author.bot) return;
                if (!message.content.startsWith(prefix)) return;
                var params = message.content.substring(prefix.length).split(" ")
                var caller = params[0]
                
                // Is that command exist?
                if (caller === "help") {
                    return message.member.send(require('../utils/getHelpList')(this.client.commands));
                }

                if (!this.client.commands.has(caller)) {
                    const errorMsg = this.client.data.get(guild.id).errorMsg
                    return channel.send(errorMsg[Math.floor(Math.random() * errorMsg.length)] || "Em không làm đâu :<")
                } else {
                    const command = this.client.commands.get(caller)
                    const helpReg = new RegExp(`^[${prefix}${cfg.prefix}]${caller}\\s{1}help$`);
                    if (content.match(helpReg)) {
                        var em = new Discord.RichEmbed()
                        var num = Math.floor(Math.random() * 256)
                        em.setColor([num, num, num])
                        em.setTitle(`How to use \`${caller}\``)
                        em.setDescription(command.help)
                        return channel.send(em);
                    }

                    // Are u good enough to use this?
                    if (command.category == "admin") {
                        if (!message.member.permissions.has("ADMINISTRATOR")) {
                            return channel.send(translater.admin_warn[this.client.data.get(guild.id).lang].replace("@user", message.member))
                        }
                    }
                    if (command.category == "creator" && message.author.id != process.env.owner) {
                        return channel.send(translater.owner_warn[this.client.data.get(guild.id).lang])
                    }

                    if (command.nsfw == true && message.channel.nsfw == false) {
                        return this.client.lewd_warning(message);
                    }

                    // Are u too fast?
                    var cdkey = caller + message.author.id
                    var cdTime = command.cd * 1000
                    if (this.cd.has(cdkey)) {
                        var exp = this.cd.get(cdkey)
                        if (Date.now() < exp) {
                            return channel.send(translater.cooldown_warn[this.client.data.get(guild.id).lang])
                        }
                    }

                    // Set new cooldown
                    this.cd.set(cdkey, Date.now() + cdTime)
                    setTimeout(() => {
                        this.cd.delete(cdkey)
                    }, cdTime)

                    
                    // Try to execute command
                    try {
                        this.client.commands.get(caller).run(message, params)
                    } catch (error) {
                        console.log(error)
                    }
                }
            })
            .on('messageDelete', () => {
            })
            .on('messageDeleteBulk', () => {
            })
            .on('messageReactionAdd', () => {
            })
            .on('messageReactionRemove', () => {
            })
            .on('messageReactionRemoveAll', () => {
            })
            .on('messageUpdate', () => {
            })
            .on('presenceUpdate', () => {
            })
            .on('rateLimit', () => {
            })
            .on('reconnecting', () => {
            })
            .on('resume', () => {
            })
            .on('roleCreate', () => {
            })
            .on('roleDelete', () => {
            })
            .on('roleUpdate', () => {
            })
            .on('typingStart', () => {
            })
            .on('typingStop', () => {
            })
            .on('userNoteUpdate', () => {
            })
            .on('userUpdate', () => {
            })
            .on('voiceStateUpdate', () => {
            })
            .on('warn', () => {
            })
            .on('webhookUpdate', () => {
            })

        this.client.login(cfg.token);
    }
}
