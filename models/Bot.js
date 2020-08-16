const Discord = require('discord.js');
const fs = require('fs');
const load_cmd = require('../utils/load_command.js');
const load_data = require('../utils/load_data.js');
const translator = require('./config').translate;
const read_data = require('../utils/read_data');
const snek = require('snekfetch');
const defaultAction = require('./DefaultAction');
const event_on_message = require('../events/on_message');
module.exports = class Bot {
    constructor(cfg) {
        this.prefix = cfg.prefix;
        this.startChannel = cfg.startChannel;
        this.ready = false;
        this.sleep = false;
        this.aliases = new Object();
        this.conn = null;
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
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
            .on('message', message => event_on_message(this, message));
        this.client.login(cfg.token).then(r => console.log('Logged in'));
    }
};
