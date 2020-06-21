const Discord = require('discord.js');
const fs = require('fs');
const load_cmd = require('../utils/load_command.js');
const load_data = require('../utils/load_data.js');
const translator = require('./config').translate;
var read_data = require('../utils/read_data');
const snek = require('snekfetch');
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
        this.client.jobList = new Discord.Collection();
        this.client.lewd_warning = msg => {
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle("NSFW")
                .setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif'))};
        this.client.update_data = function () {
            fs.writeFile("models/database.json",
                JSON.stringify(this.data.array()),
                {encoding: "utf8"}, (err) => {
                if (err) {
                    console.log(err);
                }
            })
        };
        this.client
            .once('ready', async () => {
                try {
                    await this.client.user.setActivity("loading to 99%", {
                        type: "WATCHING"
                    });
                    this.client.commands = await load_cmd(cfg.cmdType);
                    let guildIdList = this.client.guilds.cache.map(g => g.id);
                    this.client.data = await load_data(guildIdList);
                    this.ready = true;
                    // this.client.jobList.set('bot_sleep', new CronJob('0 0 6 * * *', () => {
                    //     try {
                    //         if (this.sleep) {
                    //             this.client.channels.get('523902271164252160').send('Sleep')
                    //             this.sleep = false
                    //         } else {
                    //             this.client.channels.get('523902271164252160').send('Wake')
                    //             this.sleep = true
                    //         }
                    //     } catch (error) {
                    //         console.error(error);
                    //     }
                    // }, null, true, 'Asia/Ho_Chi_Minh'));
                    console.log(`Loaded custom data of ${this.client.data.size} guild`);

                    if (this.startChannel) {
                        let _startChannel = await this.client.channels.cache.get(this.startChannel);
                        await _startChannel.send('onee-chan, onii-chan, Sagiri đã online rồi đây!',{
                            embed: {
                                image: {
                                    url: 'https://i.imgur.com/VRXDYp2.gif'
                                }
                            }
                        })
                    }
                } catch (e) {
                    console.log(e);
                }
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
                };
                data.push(new_data);
                this.client.data.set(g.id, new_data)
            })
            .on('guildDelete', (g) => {
                this.client.data.delete(g.id);
                this.client.update_data();
            })
            .on('guildMemberAdd', async (member) => {
                let channel = member.guild.channels.find(c => {
                    return c.name === this.client.data.get(member.guild.id).welcomeChannel;
                });
                if (channel === undefined) return;
                let wlist = this.client.data.get(member.guild.id).welcomeMsg;
                let ran = Math.floor(Math.random() * wlist.length);
                channel.send(wlist[ran].replace("@user", `${member}`));
            })
            .on('message', async (message) => {
                if (message.channel.type === "dm") return;
                if (!this.ready) return console.log('Bot is not ready.');
                // if (defaultAction.actionList[message.content]) {
                //     defaultAction._do(defaultAction.actionList[message.content]);
                //     return;
                // }
                const guild = message.guild;
                const channel = message.channel;
                const content = message.content;
                const prefix = this.client.data.get(guild.id).prefix || cfg.prefix;
                if (message.author.bot) return;
                if (!message.content.startsWith(prefix)) return;
                let params = message.content.substring(prefix.length).split(" ");
                let caller = params[0];

                // Is that command exist?
                if (caller === "help") {
                    return await message.member.send(require('../utils/getHelpList')(this.client.commands));
                }

                if (!this.client.commands.has(caller)) {
                    const errorMsg = this.client.data.get(guild.id).errorMsg;
                    return await channel.send(errorMsg[Math.floor(Math.random() * errorMsg.length)] || "Em không làm đâu :<")
                } else {
                    const command = this.client.commands.get(caller);
                    const helpReg = new RegExp(`^[${prefix}${cfg.prefix}]${caller}\\s{1}help$`);
                    if (content.match(helpReg)) {
                        let em = new Discord.MessageEmbed();
                        let num = Math.floor(Math.random() * 256);
                        em.setColor([num, num, num]);
                        em.setTitle(`How to use \`${caller}\``);
                        em.setDescription(command.help);
                        return await channel.send(em);
                    }

                    // Are u good enough to use this?
                    if (command.category === "admin") {
                        if (!message.member.permissions.has("ADMINISTRATOR")) {
                            return await channel.send(
                                translator.admin_warn[this.client.data.get(guild.id).lang]
                                    .replace("@user", message.member)
                            );
                        }
                    }
                    if (command.category === "creator" && message.author.id !== process.env.owner) {
                        return await channel.send(translator.owner_warn[this.client.data.get(guild.id).lang]);
                    }
                    if (command.nsfw === true && message.channel.nsfw === false) {
                        return this.client.lewd_warning(message);
                    }
                    // Are u too fast?
                    let cdkey = caller + message.author.id;
                    let cdTime = command.cd * 1000;
                    if (this.cd.has(cdkey)) {
                        let exp = this.cd.get(cdkey);
                        if (Date.now() < exp) {
                            return channel.send(translator.cooldown_warn[this.client.data.get(guild.id).lang]);
                        }
                    }
                    // Set new cooldown
                    this.cd.set(cdkey, Date.now() + cdTime);
                    setTimeout(() => {
                        this.cd.delete(cdkey)
                    }, cdTime);

                    // Try to execute command
                    try {
                        this.client.commands.get(caller).run(message, params)
                    } catch (error) {
                        console.log(error);
                    }
                }
            });
        this.client.login(cfg.token).then(r => console.log('Logged in'));
    }
};
