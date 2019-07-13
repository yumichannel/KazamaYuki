const Collection = require('discord.js').Collection;
const fs = require('fs')
const CustomData = require('../models/CustomData')
const default_prefix = require('../models/config').prefix
module.exports = (guildIdList=[])=>{
    return new Promise((resolve,reject)=>{
        var data = new Collection();
        fs.readFile('models/database.json','utf8',(err,str)=>{
            if(err){
                console.log(err);
                resolve(null)
            }else{
                var datajson = JSON.parse(str)
                var changed = false
                for (const id of guildIdList) {
                    var cdata = datajson.find(item=>item.guild_id==id)
                    if(cdata==undefined){
                        var new_data = new CustomData({guild_id:id})
                        data.set(id,new_data)
                        datajson.push(new_data)
                        changed=true
                    }else{
                        data.set(id,new CustomData(cdata))
                    }
                }
                if(changed==true){
                    fs.writeFileSync('models/database.json',JSON.stringify(datajson),{encoding:"utf8"})
                }
                resolve(data);
            }
        })
    })
}