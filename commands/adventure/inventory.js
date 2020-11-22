const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "inventory",
    cd: 10,
    description: "Check inventory",
    nsfw: false,
    help: [],
    enable: true,
    alias: ["iv","myitems"],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        let member = bot.members.get(msg.member.id);
        if (!member) return;
        let member_items = await bot.execsql(`select * from member_items LEFT JOIN shop_item on member_items.item_id = shop_item.id where member_items.user_id = "${member.user_id}"`);
        if (member_items.length < 1) {
            let embed_mem_items = new Discord.MessageEmbed;
            embed_mem_items.setTitle(`${member.getName()}'s inventory`)
            embed_mem_items.setDescription("Yep, you have NOTHING.");
        } else {
            let count = 0;
            let page = 1;
            let per_page = 4;
            let max_page = Math.ceil(member_items.length / per_page);
            let mode = "render_list";
            let _msg;
            while (true) {
                if (mode == "close") break;
                if (mode == "render_list") {
                    let embed_mem_items = new Discord.MessageEmbed;
                    embed_mem_items.setTitle(`${member.getName()}'s inventory`);
                    for (let i = per_page * (page - 1); i < member_items.length && i < per_page * page && count < per_page; i++) {
                        embed_mem_items.addField(
                            i + ". " + member_items[i].name,
                            "quantity: " + member_items[i].quantity,
                            false
                        );
                        count++;
                    }
                    embed_mem_items.setFooter(`page ${page} / ${max_page}`);
                    _msg = await msg.author.send(embed_mem_items);
                }
                let collected = await _msg.channel.awaitMessages(m => m.author.id == member.user_id, {max: 1, time: 20000});
                if (collected.size == 0) {
                    await _msg.delete();
                    await msg.author.send(">>> *Inventory closed automatically.*");
                    break;
                }
                let content = collected.first().content;
                if (content == "pnext" && page < max_page) {
                    mode = "render_list";
                } else if (content == "pprev" && page > 1) {
                    mode = "render_list";
                } else if (content == "close") {
                    await _msg.delete();
                    await msg.author.send(">>> *closed inventory*");
                    mode = "close";
                }
            }
        }
    }
}
module.exports = new Command(data)