/**
 * Load guilds custom data from database
 * Save guild custom defailt data if not exist in database
 */

const Collection = require('discord.js').Collection;
const fs = require('fs');
const CustomData = require('../models/CustomData');
const default_prefix = require('../models/config').prefix;
module.exports = (guildIdList = [], conn)=>{
    return new Promise((resolve,reject)=>{
        var data = new Collection();
        var new_guilds = [];
        conn.query("select * from guild_custom_data", (err, guilds) => {
            if (err) {
                console.log(err);
                resolve(null);
            }
            for (const id of guildIdList) {
                var cdata = guilds.find(item=>item.guild_id==id)
                if(cdata==undefined){
                    var new_data = new CustomData({guild_id:id})
                    data.set(id,new_data)
                    new_guilds.push(new_data)
                }else{
                    data.set(id,new CustomData(cdata))
                }
            }
            if (new_guilds.length > 0) {
                for (let i = 0; i < new_guilds.length; i++) {
                    conn.query("insert into guild_custom_data(guild_id,prefix,lang) values(?,?,?)", 
                        [new_guilds[i].guild_id, new_guilds[i].prefix, new_guilds[i].lang],
                        (err, res) => {
                            if (err) console.log(err);
                        });
                }
            }
            resolve(data);
        });
    })
}