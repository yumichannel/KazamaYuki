const Discord = require('discord.js');
const Command = require('../../models/Command');
const tranlater = require('../../models/config').translate.greeting_warn
const data = {
    caller: "greeting",
    cd: 1,
    run: function(msg=new Discord.Message,params=[]){
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
                var found = msg.guild.channels.find("name",channel)
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