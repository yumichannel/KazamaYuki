const Collection = require('discord.js').Collection;
const fs = require('fs');
module.exports = (categories = [])=>{
    return new Promise((resolve,reject)=>{
        var commands = new Collection();
        categories.forEach(cate=>{
            var dir = `commands/${cate}`;
            const commandFiles = fs.readdirSync(dir).filter(file=>file.endsWith('.js'));
            commandFiles.forEach(file=>{
                var command = require(`../${dir}/${file}`);
                if (command.enable) {
                    command.setCategory(cate);
                    commands.set(command.caller,command);
                    console.log(`${command.caller} loading...`)
                }
            })
        }) ;
        resolve(commands);
    })
};
