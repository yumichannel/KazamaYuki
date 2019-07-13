const Discord = require('discord.js');
const Command = require('../../models/Command.js');
const data = {
    caller: "ping",
    cd: 1,
    run: function(msg=new Discord.Message){
        msg.channel.send(`${msg.client.ping.toFixed(0)} pong!`);
    }
}
module.exports = new Command(data)