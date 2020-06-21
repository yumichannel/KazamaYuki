const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "roll",
    cd: 1,
    enable: true,
    run: function (msg = new Discord.Message, params = []) {
        params = params.slice(1).join(" ");
        if (params == "") return msg.channel.send("No option provided");
        var option = params.split("-");
        var num = Math.floor(Math.random() * option.length);
        msg.channel.send("```" + option[num] + "```")
    }
}
module.exports = new Command(data)
