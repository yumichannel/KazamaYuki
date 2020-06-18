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
