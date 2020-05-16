const Discord = require('discord.js');
const Command = require('../../models/Command.js');
const data = {
    caller: "ping",
    cd: 1,
    run: function(msg=new Discord.Message){
        msg.channel.send('pong!');
    }
};
module.exports = new Command(data);
