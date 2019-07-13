const Discord = require('discord.js');
const Command = require('../../models/Command');
const snek = require("snekfetch");
const data = {
    caller: "yan",
    cd: 1,
    nsfw: true,
    run: function(msg=new Discord.Message,params=[]){
        const src = "https://yande.re/";
        var em = new Discord.RichEmbed();
        switch(params[1]){
            case "daily":{
                snek.get(src+"post/popular_recent.json").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
                break
            }
            case "weekly":{
                snek.get(src+"post/popular_recent.json?period=1w").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
                break
            }
            case "monthly":{
                snek.get(src+"post/popular_recent.json?period=1m").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
                break
            }
            case "yearly":{
                snek.get(src+"post/popular_recent.json?period=1y").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
                break
            }
            case "":{
                snek.get(src+"post.json?tags=order%3Arandom").then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
                break
            }
            default:{
                let tag = params[1].replace(" ","_")
                snek.get(src+"post.json?tags="+encodeURI(tag)).then(res=>{
                    var result = res.body
                    if(result.length<1) return
                    var ran = Math.floor(Math.random()*result.length)
                    const imgurl = result[ran].sample_url;
                    em.setImage(imgurl)
                    em.setDescription(`[Full resolution](${result[ran].file_url})`)
                    msg.channel.send(em)
                })
            }
        }
    }
}
module.exports = new Command(data)