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
const gold_drop_rate = [0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 1000, 1000, 10000];
module.exports = class Bot {
    constructor(cfg) {
        this.client = new Discord.Client();

        this.prefix = cfg.prefix;
        this.startChannel = cfg.startChannel;
        this.ready = false;
        this.conn = null;
        this.data = new Discord.Collection();
        this.members = new Discord.Collection();
        this.members_update = false;
        this.adventure_data_sync = null;
        this.adventure_const = {
            attendance_timeout: 30000,
            attendance_gold: 200
        };
        this.world_data = {
            gold_drop: {
                notice_at: null,
                noticed: false,
                drop_at: null,
                dropped: true,
                amount: 0
            }
        }

        this.aliases = new Object();
        this.commands = new Discord.Collection();
        this.cd = new Discord.Collection();

        this.client.caroGame = new Discord.Collection();
        this.execsql = (sql = "") => {
            return new Promise((resolve) => {
                this.conn.query(sql, (err, res) => {
                    if (err) resolve(err);
                    resolve(res);
                });
            })
        };
        this.client.lewd_warning = msg => {
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle("NSFW")
                .setImage('https://media1.tenor.com/images/b1b3e852ed8be4622f9812550beb8d88/tenor.gif'))
        };
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
                        (function (self) {
                            return function () {
                                let now = Date.now();
                                if (self.members_update) {
                                    console.log(`${Date.now()}: Sync data up to database`);
                                    for (const [user_id, mem] of self.members) {
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
                                    self.members_update = false;
                                }

                                //Loop check gold_drop_event
                                if (self.world_data.gold_drop.dropped) {

                                } else {
                                    if (!self.world_data.gold_drop.notice_at) {
                                        self.world_data.gold_drop.notice_at = now + 10000;
                                        self.world_data.gold_drop.drop_at = now + 20000;
                                    } else {
                                        if (self.world_data.gold_drop.notice_at <= now) {
                                            if (!self.world_data.gold_drop.noticed) {
                                                self.client.emit("gold_drop_event_notice");
                                            } else {
                                                if (self.world_data.gold_drop.drop_at <= now) {
                                                    self.client.emit("gold_drop_event_drop");
                                                }
                                            }
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
            .on('member_chat', (user_id, channel) => {
                let member = this.members.get(user_id);
                member.exp += 6;
                member.balance++;
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
            .on("gold_drop_event_notice", async () => {
                let guilds = this.client.guilds.cache;
                for (const [gid, g] of guilds) {
                    let noti_ch = g.channels.cache.find(c => c.name == "tester-tester");
                    if (noti_ch) {
                        noti_ch.send(`> Something is coming in <#${noti_ch.id}>`);
                    }
                }
                this.world_data.gold_drop.noticed = true;
            })
            .on("gold_drop_event_drop", async () => {
                let guilds = this.client.guilds.cache;
                let code = Math.floor(Math.random()*10)+""+
                            Math.floor(Math.random()*10)+""+
                            Math.floor(Math.random()*10)+""+
                            Math.floor(Math.random()*10)+""+
                            Math.floor(Math.random()*10)
                for (const [gid, g] of guilds) {
                    let _g = this.data.get(gid);
                    let noti_ch = null;
                    if (_g && (noti_ch = g.channels.cache.find(c => c.id == _g.adv_notif_channel))) {
                        let amount = gold_drop_rate[Math.floor(Math.random() * gold_drop_rate.length)];
                        let notice = await noti_ch.send(`> *A Chest appears. There is a note on the chest, It says ${code}*.`);
                        noti_ch.awaitMessages(m => {
                            if (m.content == code && this.members.has(m.author.id)) {
                                let mem = this.members.get(m.author.id)
                                mem.balance += amount;
                                mem.process.sync = true;
                                this.members_update = true;
                                m.channel.send(`> *${mem.getName()} gains ${amount}G from the chest.*`)
                                return true;
                            }
                            return false;
                        },{max: 1, time: 20000, errors: ['time']})
                            .catch(collected => {
                                notice.delete();
                                noti_ch.send("> *Chest disappeared!*");
                            });;
                    }
                }
                this.world_data.gold_drop.dropped = true;
            });
        this.client.login(cfg.token).then(r => console.log('Logged in'));
    }
};
