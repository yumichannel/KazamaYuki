const Discord = require('discord.js');
const ytdl = require('ytdl-core-discord');
const fs = require('fs');
module.exports = class MPlayer {
    constructor() {
        this.current = null;
        this.lastPlay = null;
        this.queue = [];
        this.pause = false;
        this.connection = null;
        this.chatChannel = null;
        this.loop = 2;
        this.playerStatMsgId = null;
        this.play = async () => {
            if (!this.current && this.queue.length === 0) {
                this.connection.dispatcher.end();
                return this.chatChannel.send('End of queue', {code: true});
            }
            let videoID = this.current.id;

            this.connection.play(await ytdl(this.current.url, {
                quality: 'highest',
                filter: 'audioonly',
                opusEncoded: true
            }), { type: 'opus' })
                .on('finish', () => this.onFinish())
                .on('error', err => this.onError(err))
                .on("start", () => {
                    let msg = ":arrow_forward: " + this.current.info.title;
                    let nextMsg = "🔽" + (this.queue.length > 0 ? this.queue[0].info.title : '');
                    this.chatChannel.send(new Discord.MessageEmbed({
                        color: "BLUE",
                        description: msg.length > 100 ? msg.substr(0, 100) + "..." : msg,
                        footer: {text: nextMsg.length > 100 ? nextMsg.substr(0, 100) + "..." : nextMsg},
                    }));
                });
        }
        this.onFinish = () => {
            this.next();
        }
        this.onError = (err) => {
            console.log("Error event:\n"+err);
        }
        this.next = (skip = false) => {
            if (skip) {
                this.current = this.queue.shift();
            } else {
                if (this.loop === 0) {
                    this.current = this.queue.shift();
                }
                if (this.loop === 1) {
                    this.current = this.current;
                }
                if (this.loop === 2) {
                    this.queue.push(this.current);
                    this.current = this.queue.shift();
                }
            }
            this.play();
        }
    }
}