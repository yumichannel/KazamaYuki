const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "eval",
    cd: 0,
    run: function(message=new Discord.Message,params=[]){
        let text = message.content.substring(params[0].length+2);
        let embed = new Discord.MessageEmbed;
        try {
            let ev = eval(text)
            if(typeof ev !== 'string'){
                ev = require('util').inspect(ev)
            }
            let inp = '```js\n'+text+'```'
            let outp =  '```json\n'+ev+'```'
            embed.addField('Input',inp)
            embed.addField('Output',outp)
            message.channel.send(embed)
        } catch (error) {
            let err = `\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``
            embed.addField('Error',err)
            message.channel.send(embed);
        }
    
        function clean(text) {
            if (typeof(text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
    }
}
module.exports = new Command(data)
