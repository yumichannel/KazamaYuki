const Discord = require('discord.js');
const fs = require('fs');
const load_cmd = require('../utils/load_command.js');
const load_data = require('../utils/load_data.js');
const load_member_data = require('../utils/load_member_data.js');
const translator = require('./config').translate;
const snek = require('snekfetch');
const defaultAction = require('./DefaultAction');
const event_on_message = require('../events/on_message');
const mysql = require('mysql');
const Adventure = require("./Adventure");
module.exports = class Bot {
    constructor(cfg) {
        this.prefix = cfg.prefix;
        this.startChannel = cfg.startChannel;
        this.ready = false;
        this.cd = new Discord.Collection();
        this.conn = null;
        this.aliases = new Object();
        this.data = new Discord.Collection();
        this.members = new Discord.Collection();
        this.members_update = false;
        this.adventure_data_sync = null;
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
        this.client.caroGame = new Discord.Collection();
        this.execsql = (sql = "") => {
            return new Promise((resolve)=>{
                this.conn.query(sql,(err,res)=>{
                    if (err) resolve(err);
                    resolve(res);
                });
            })
        };
        this.client.lewd_warning = msg => {
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle("NSFW")
                .setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif'))};
        this.client
            .once('ready', async () => {
                try {
                    await this.client.user.setActivity("loading to 99%", {
                        type: "WATCHING"
                    });
                    let loader = await load_cmd(cfg.cmdType);
                    this.aliases = loader[0];
                    this.commands = loader[1];
                    if (cfg.database.mysql) {
                        this.conn = mysql.createConnection({
                            host: process.env.MYSQL_HOST || 'localhost',
                            port: process.env.MYSQL_PORT || 3306,
                            database: process.env.MYSQL_DB,
                            user: process.env.MYSQL_USERNAME || 'root',
                            password: process.env.MYSQL_PASSWORD || ''
                        });
                    }
                    let guildIdList = this.client.guilds.cache.map(g => g.id);
                    this.data = await load_data(guildIdList, this.conn);
                    this.members = await load_member_data(this.conn);
                    this.ready = true;
                    this.adventure_data_sync = setInterval(
                        (function(self) {
                            return function() {
                                if (self.members_update) {
                                    for (const [user_id,mem] of self.members) {
                                        console.log(`${Date.now()}: Sync data up to database`);
                                        if (mem.process.sync) {
                                            self.execsql(`
                                                update member_info
                                                set name = "${mem.name}",
                                                    sex = ${mem.sex},
                                                    race = ${mem.race},
                                                    level = ${mem.level},
                                                    exp = ${mem.exp},
                                                    balance = ${mem.balance}
                                                where user_id = "${mem.user_id}"
                                            `);
                                            mem.process.sync = false;
                                            self.members.set(user_id, mem);
                                        }
                                    }
                                }
                            }
                        })(this),
                        cfg.refresh_timeloop
                    );
                    console.log(`Loaded custom data of ${this.data.size} guilds`);
                } catch (e) {
                    console.log(e);
                }
            })
            .on('guildCreate', async (g) => {
            })
            .on('guildDelete', (g) => {
            })
            .on('guildMemberAdd', async (member) => {
                // let wc_channel = this.client.data.get(member.guild.id).wc_channel;
                // if (wc_channel) {
                //     let channel = member.guild.channels.find(c => c.id == wc_channel);
                // }
                // if (channel === undefined) return;
                // let wlist = this.client.data.get(member.guild.id).welcomeMsg;
                // let ran = Math.floor(Math.random() * wlist.length);
                // channel.send(wlist[ran].replace("@user", `${member}`));
            })
            .on('message', message => event_on_message(this, message))
            .on('member_chat', (user_id, channel)=>{
                let member = this.members.get(user_id);
                member.exp += 6;
                member.process.sync = true;
                console.log(`${Date.now()}: ${member.name} gain 6xp from chat`)
                if (member.exp >= member.exp_max && !member.process.levelup) {
                    member.process.levelup = true;
                    this.members.set(user_id, member);
                    this.client.emit("member_level_up", member, channel);
                } else {
                    this.members.set(user_id, member);
                }
                this.members_update = true;
            })
            .on("member_level_up", async (member, channel) => {
                member.process.levelup = false;
                member = Adventure.calculateXP(member);
                this.members.set(member.user_id, member);
                await channel.send(`Level up! <@${member.user_id}> reached level ${member.level}`);
                console.log(`${Date.now()}: ${member.name} is now level ${member.level}`);
            })
        this.client.login(cfg.token).then(r => console.log('Logged in'));
    }
};
