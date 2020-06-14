'use strict';
const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const load_cmd = require('../utils/load_music_command.js');
const report = require('../utils/report');
const Player = require('../models/MPlayer');
var fs = require('fs');

module.exports = class MusicBot {
    constructor(cfg) {
        this.client = new Discord.Client();
        this.commands = new Discord.Collection();
        this.client.counter = 0;
        this.client.report = report;
        this.client.on('ready', async () => {
            console.log(`Logged in as ${this.client.user.tag}!`);
            try {
                this.commands = await load_cmd();
            } catch (e) {
                console.error(e);
            }
            //Init music player for all guilds
            this.client.guilds.cache.forEach((guild, guildId) => {
                guild.music_player = new Player();
            });
        });

        this.client.on('message', async msg => {
            if (msg.author.bot
                || !msg.content.startsWith('m,')
            ) {
                return;
            }

            // let gid = msg.guild.id;
            // if (!this.client.music_player.has(gid)) {
            //     let player = new Player();
            //     this.client.music_player.set(gid, player);
            // }
            // let noprefix = msg.content.substring(2);
            // let args = noprefix.split(' ');
            // if (args[0] === 'join') {
            //     if (msg.member.voice.channel) {
            //         try {
            //             player.connection = await msg.member.voice.channel.join();
            //         } catch (e) {
            //             return console.log(e.message);
            //         }
            //     }
            // }
            // if (args[0] === 'play') {
            //     if (!args[1] || !player.connection) return;
            //     if (!ytdl.validateURL(args[1])) return;
            //     let vid = args[1];
            //     try {
            //         if (player.connection.dispatcher) {
            //             player.queue.push(vid);
            //         } else {
            //             play(msg, vid);
            //         }
            //     } catch (e) {
            //         console.log(e.message)
            //     }
            // }
            // if (args[0] === 'loop') {
            //     player.loop = parseInt(args[1]);
            // }
            // if (args[0] === 'skip') {
            //     play(msg, 'skip');
            // }
            //
            // this.client.music_player.set(gid, player);

            /** new design */
            let no_prefix = msg.content.substring(2);
            let args = no_prefix.split(' ');
            if (this.commands.has(args[0])) {
                this.commands.get(args[0]).run(this.client,msg,args);
            } else {
                msg.channel.send('command not found');
            }
        });

        this.client.login(cfg.token);
    }
};
