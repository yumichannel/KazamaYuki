const Collection = require('discord.js').Collection;
const fs = require('fs');
module.exports = (categories = [])=>{
    return new Promise((resolve,reject)=>{
        let commands = new Collection();
        let dir = `music_commands`;
        const commandFiles = fs.readdirSync(dir).filter(file=>file.endsWith('.js'));
        commandFiles.forEach(file=>{
            let command = require(`../${dir}/${file}`);
            if (command.enable) {
                command.setCategory('music');
                commands.set(command.caller,command);
                console.log(`${command.caller} loading...`)
            }
        })
        resolve(commands);
    })
};
