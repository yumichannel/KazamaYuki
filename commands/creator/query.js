const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "query",
    cd: 0,
    enable: true,
    run: function(msg=new Discord.Message,params=[]){
        let text = msg.content.substring(params[0].length+2);
        let result = null
        msg.client.db.query(text,res=>console.log(res));
    }
}
module.exports = new Command(data)
