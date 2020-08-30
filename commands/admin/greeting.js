const Discord = require('discord.js');
const Command = require('../../models/Command');
const tranlater = require('../../models/config').translate.greeting_warn
const data = {
    caller: "greeting",
    description: "Welcome new member with customizable words",
    help: [
        ["greeting -a xyz @user","Add custom greeting message \"xyz @user\", place @user for mention new member."],
        ["greeting -l","Listing all custom message marked with position number."],
        ["greeting -d 0","Delete message has position 0 as seen in listing, replace 0 with **all** for deleting all."],
        ["greeting -c general","Set channel for sending greeting message, default **general**"]
    ],
    cd: 1,
    enable: true,
    run: function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        const lang = msg.client.data.get(msg.guild.id).lang
        // option available: "-a" "-d" "-c" "-l"

        // params[1] : option 
        switch (params[1]) {
            case "-a":  //Add message
                var message = params.slice(2).join(" ")
                addMessage(message).then(res=>{
                    msg.client.update_data()
                    msg.channel.send(`Added new greeting message: ${message}`,{code:true})
                }).catch(reason=>{
                    msg.channel.send(reason)
                })
                break;
            case "-d":  //Delete message
                deleteMessage(params[2]).then(res=>{
                    msg.client.update_data();
                    msg.channel.send(res,{code:true})
                }).catch(reason=>{
                    msg.channel.send(reason,{code:true})
                })
                break;
            case "-c":  //Channel set
                setChannel(params[2]).then(res=>{
                    msg.client.update_data()
                    msg.channel.send(res,{code:true})
                }).catch(reason=>{
                    msg.channel.send(reason,{code:true})
                })
                break;
            case "-l":  //
                var temp_list = "";
                var counter = 0
                msg.client.data.get(msg.guild.id).welcomeMsg.forEach(message=>{
                    temp_list += `[${counter}] ${message}\n`;
                    counter++;
                })
                if (!temp_list) temp_list += "Empty";
                msg.channel.send(temp_list,{code:"scss"})
                break;
            default:
                break;
        }

        function addMessage(message){
            return new Promise((resolve,reject)=>{
                if(message){
                    if(msg.client.data.get(msg.guild.id).welcomeMsg.findIndex(m=>m==message)==-1){
                        msg.client.data.get(msg.guild.id).welcomeMsg.push(message)
                        resolve(1)
                    }else{
                        reject("Repeat message")
                    }
                }else{
                    reject("Invalid message")
                }
            })
        }
        function deleteMessage(index){
            return new Promise((resolve,reject)=>{
                if(index == "all"){
                    msg.channel.send(tranlater.confirm[lang] || "Are you sure? (Yes/No)")
                    var collector = msg.channel.createMessageCollector(m=>m.author.id==msg.author.id,{time:10000})
                    collector.on("collect",message=>{
                        console.log(message.content.toLowerCase())
                        if(message.content.toLowerCase() == "yes"){
                            msg.client.data.get(msg.guild.id).welcomeMsg = ['Hello @user']
                            collector.stop()
                            resolve(tranlater.delall_success[lang]||"Deleted all greeting message")
                        }
                        if(message.content.toLowerCase() == "no"){
                            collector.stop()
                            reject(tranlater.del_cancel[lang] || "Abort delete all process.")
                        }
                    })
                }else if(index>=0){
                    var deleted = msg.client.data.get(msg.guild.id).welcomeMsg.splice(index,1)
                    resolve((tranlater.del_success[lang] || "Deleted greeting message:")+deleted)
                }else{
                    reject(tranlater.del_fail[lang] || "invalid delete mode")
                }
            })
        }
        function setChannel(channel){
            return new Promise((resolve,reject)=>{
                var found = msg.guild.channels.cache.find(c=>c.name == channel);
                if(found){
                    if(found.type=="text"){
                        msg.client.data.get(msg.guild.id).welcomeChannel = channel
                        resolve(`Greeting channel set to \`${channel}\``)
                    }else{
                        reject(`\`${channel}\` is not text channel`)
                    }
                    
                }else{
                    reject(`\`${channel}\` is not exist`)
                }
            })
        }
    }
}
module.exports = new Command(data)
