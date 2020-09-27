const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Member = require('../../models/Adventure').Member;
const data = {
    caller: "register",
    cd: 10,
    description: "Register as member of Yuki Hazama",
    nsfw: false,
    help: [],
    enable: true,
    alias: ['reg'],
    run: async function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        if (bot.members.has(msg.author.id)) return console.log(`${msg.author.username} already has an account.`);
        const sexs = ["shounen","shoujo","futanari"];
        const races = await bot.execsql("select * from adv_race");
        const races_name = races.map(r => r.race_name);
        let new_acc = new Member({user_id: msg.author.id});
        let botmsg = await msg.author.send("Let's become Yuki's member!");
        botmsg = await msg.author.send("\---------------------------");
        try {
            //Question 1: name
            botmsg = await msg.author.send("Pick your name, the one Yuki will call you:");
            let answer = await botmsg.channel.awaitMessages(m=>m.author.id===msg.author.id, {time: 60000, max: 1});
            if (answer.first().content.trim().length !== "") {
                new_acc.name = answer.first().content;
            }
            //Question 2: sex
            botmsg = await msg.author.send("Shounen(1)? Shoujo(2)? Futanari(3)?");
            answer = await botmsg.channel.awaitMessages(m => {
                if (m.author.id === msg.author.id) {
                    let sex = m.content.trim();
                    if (!isNaN(sex) && sex >= 1 && sex <= 3 ) {
                        new_acc.sex = parseInt(sex);
                        return true;
                    }
                }
                return false;
            }, {time: 60000, max: 1});
            //Question 3: Race
            botmsg = await msg.author.send("Chose race: "+races_name.join(" | "));
            answer = await botmsg.channel.awaitMessages(m => {
                if (m.author.id === msg.author.id) {
                    let r_index = races.findIndex(r => r.race_name == m.content.trim());
                    if (r_index > 0) {
                        new_acc.race = races[r_index].race_id;
                        return true;
                    }
                }
                return false;
            }, {time: 60000, max: 1});

            //Init exp_max
            new_acc.exp_max = 100 + new_acc.level * (new_acc.level / 2);

            //Save
            bot.members.set(new_acc.user_id,new_acc);
            let reg_result = await bot.execsql(`insert into member_info values("${new_acc.user_id}","${new_acc.name}",${new_acc.sex},${new_acc.race},${new_acc.level},${new_acc.exp},${new_acc.balance})`);
            if (reg_result && reg_result.affectedRows) {
                botmsg.channel.send("Welcome new member, for more information, read the guideline here:...");
                msg.channel.send(`${msg.member} joined as YH's member under the name of *${new_acc.name}*`);
            }
        } catch (err) {
            return botmsg.channel.send("Failed to register.");
        }
    }
}
module.exports = new Command(data)