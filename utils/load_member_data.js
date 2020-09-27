/**
 * Load members data from database;
 */

const Collection = require('discord.js').Collection;
const fs = require('fs');
const {Member, getRequireExp} = require('../models/Adventure');
const default_prefix = require('../models/config').prefix;
module.exports = (conn)=>{
    return new Promise((resolve,reject)=>{
        var data = new Collection();
        conn.query("select * from member_info", (err, members) => {
            if (err) {
                console.log(err);
                resolve(null);
            }
            for (let i = 0; i < members.length; i++) {
                let mem = new Member(members[i]);
                mem.exp_max = getRequireExp(mem.level);
                data.set(members[i].user_id, mem);
            }
            resolve(data);
        });
    })
}