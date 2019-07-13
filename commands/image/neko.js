const Discord = require('discord.js');
const Command = require('../../models/Command');
const snekfetch = require('snekfetch');
const data = {
    caller: "neko",
    cd: 1,
    run: function(msg=new Discord.Message,params=[]){
        var src = 'https://nekos.life/'
        var lewd = false
        var tag = ""
        if(params[1]==='lewd'){
            lewd=true
            tag='lewd'
        }
        if(lewd && msg.channel.nsfw===false){
            msg.client.lewd_warning(msg)
            return
        }else{
            snekfetch.get(src+tag).then(m=>{
                var body = m.body.toString();
                let strindex = body.split('"')
                let ans = strindex.find(n=>{
                    if(lewd){
                        return n.indexOf('https://cdn.nekos.life/lewd')===0
                    }else{
                        return n.indexOf('https://cdn.nekos.life/neko')===0
                    }
                })
                msg.channel.send(new Discord.RichEmbed().setImage(ans))
            })
        }
    }
}
module.exports = new Command(data)