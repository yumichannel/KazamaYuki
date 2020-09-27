const Collection = require('discord.js').Collection;
const fs = require('fs');
module.exports = (categories = [])=>{
    return new Promise((resolve,reject)=>{
        var aliases = new Object();
        var commands = new Collection();
        categories.forEach(cate=>{
            var dir = `commands/${cate}`;
            const commandFiles = fs.readdirSync(dir).filter(file=>file.endsWith('.js'));
            commandFiles.forEach(file=>{
                var command = require(`../${dir}/${file}`);
                if (command.enable) {
                    command.setCategory(cate);
                    commands.set(command.caller,command);
                    let alias = command.caller;
                    aliases[command.caller] = command.caller;
                    if (Array.isArray(command.alias) && command.alias.length > 0) {
                        for (const a of command.alias) {
                            if (!aliases.hasOwnProperty(a)) {
                                aliases[a] = command.caller;
                                alias += ' | ' + a;
                            }
                        }
                    }
                    console.log(`${command.caller} loading... as `+ alias);
                }
            })
        }) ;
        resolve([
            aliases,
            commands
        ]);
    })
};
