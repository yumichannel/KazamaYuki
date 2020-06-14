const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const fs = require('fs');
module.exports = class MPlayer {
    constructor() {
        this.current = null;
        this.queue = [];
        this.pause = false;
        this.connection = null;
        this.loop = 2;
        this.play = async (msg = new Discord.Message()) => {
            let videoID = ytdl.getVideoID(this.current);
            fs.access('assets/music_cache/'+videoID+'.mp3',fs.F_OK,(err) => {
                var src;
                if (err) {
                    console.log('caching '+videoID);
                    src = ytdl(this.current)
                    src.pipe(fs.createWriteStream('assets/music_cache/'+videoID+'.mp3'));
                } else {
                    src = 'assets/music_cache/'+videoID+'.mp3';
                    console.log('play '+videoID+' from cache');
                }
                this.connection.play(src)
                    .on('finish', () => this.onFinish())
                    .on("error", err => this.onError(err));
            })
        }
        this.onFinish = () => {
            console.log('End play '+this.current);
            this.next();
        }
        this.onError = (err) => {
            console.log("Error event:\n"+err);
        }
        this.next = () => {
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
            this.play();
        }
    }
}
