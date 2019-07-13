const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "onetwothree",
    cd: 10,
    run: function(msg=new Discord.Message,params=[]){
        const answer={
            win:[
                "Arghhhhhh!!!! Are you cheating me??? >.<"
            ],
            lose:[
                "Yeahhhhh!!! I win, I win!!! ^o^"
            ],
            draw:[
                "Want to play again, dude? :3"
            ]
        }
        var uwin =()=>{
            var embed = new Discord.RichEmbed()
            embed.setDescription(answer.win[0])
            msg.channel.send(embed)
        }
        var ulose =()=>{
            var embed = new Discord.RichEmbed()
            embed.setDescription(answer.lose[0])
            msg.channel.send(embed);
        }
        const list = ["scissors","rock","paper"]
        const filter = m=>m.author.id==msg.author.id;
        const collector = msg.channel.createMessageCollector(filter);
        msg.channel.send("Senpai. Let's play one,two,three.");
        collector.on('collect',m=>{
            if(m.content!="scissors" && m.content!="rock" && m.content!="paper"){
                msg.channel.send("`"+m.content+"` is not answer, Senpai =.=");
            }else{
                collector.stop();
            }
        })
        collector.on('end',m=>{
            var last = m.last();
            var choice = Math.floor(Math.random()*3);
            msg.channel.send(list[choice])
            
            if(last == list[choice]){
                var embed = new Discord.RichEmbed()
                embed.setDescription(answer.draw[0])
                msg.channel.send(answer.draw[0])
            }else{
                if(last=="scissors"){
                    if(list[choice]=="paper") uwin();
                    if(list[choice]=="rock") ulose();
                }
                if(last=="rock"){
                    if(list[choice]=="scissors") uwin();
                    if(list[choice]=="paper") ulose();
                }
                if(last=="paper"){
                    if(list[choice]=="rock") uwin();
                    if(list[choice]=="scissors") ulose();
                }
            }
        })
    }
}
module.exports = new Command(data)