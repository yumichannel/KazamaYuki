const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const Adventure = require('../../models/Adventure');
const data = {
    caller: "goshop",
    cd: 10,
    description: "Registed member can buy much thing from shop",
    nsfw: false,
    help: [
        ["pick>n","Chose option n"],
        ["exit","leave shop"],
        ["<<<","go back"]
    ],
    enable: true,
    alias: [],
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        /**
         * Idea: !goshop => show list category, chose categroy => show item list
         */
        let member = bot.members.get(msg.member.id);
        if (!member) return;
        /** @type Array */
        var mode = "category",
            shop = null,
            answer = null,
            cate = null,
            cates = null,
            loading = null,
            items = null,
            item_buy = null,
            referer_mode = null;
        const pick_pattern = /^pick>[0-9]{1,}$/;
        while (true) {
            if (mode == "category") {
                cates = await bot.execsql(`select * from shop_category`);
                shop = new Discord.MessageEmbed;
                shop.setTitle("Yuki Hazama Shop");
                shop.setDescription(`Welcome to Yuki's shop for Adventurer !!!
                if you need help, type \`;goshop help\` or ask others Adventurer.
                \\----------------------------`);
                for (let i = 0; i < cates.length; i++) {
                    shop.addField(`${cates[i].id}: ${cates[i].name}`, `${cates[i].description.substring(0,20)}...`, true);
                }
                shop = await msg.channel.send(shop);
                while (true) {
                    answer = await msg.channel.awaitMessages(m => m.author.id === msg.author.id 
                        && (m.content.trim().match(pick_pattern) 
                        || m.content.trim() == "exit" 
                        || m.content.trim() == "<<<"), 
                    { max: 1 });
                    answer = answer.first();
                    if (answer.content == "exit") break;
                    cate = cates.find(c => c.id == answer.content.trim().replace("pick>",""));
                    if (cate) {
                        mode = "items";
                        break;
                    }
                }
                if (answer.content == "exit") break;
            } else if (mode == "items") {
                try {
                    shop.delete();
                    loading = await msg.channel.send(`... loading items from collection **${cate.name}**`);
                } catch (err) {
                    console.log(err);
                    return msg.channel.send("Shop tranmission stopped!");
                }
                if (cate) {
                    items = await bot.execsql(`
                        select shop_item.*, shop_item_categoy.category_id as cate_id
                        from shop_item_categoy left join shop_item on shop_item_categoy.item_id = shop_item.id 
                        where shop_item_categoy.category_id = ${cate.id}
                    `);
                    shop = new Discord.MessageEmbed;
                    shop.setTitle(`Collection: **${cate.name}**`);
                    shop.setDescription(`${cate.description}
                    \\------------------`);
                    for (let i = 0; i < items.length; i++) {
                        shop.addField(
                            `${items[i].id}: ${items[i].name}`,
                            `- Item rank: ${items[i].rank}
                            - Require (rank/lv): ${items[i].user_rank}/${items[i].user_level}
                            - price: ${Adventure.formatPrice(items[i].price)} G`,
                            false
                        );
                    }
                    loading.delete();
                    shop = await msg.channel.send(shop);
                    while(true) {
                        answer = await msg.channel.awaitMessages(m => m.author.id === msg.author.id 
                            && (m.content.trim().match(pick_pattern) 
                                || m.content.trim() == "exit" 
                                || m.content.trim() == "<<<"), 
                        { max: 1 });
                        answer = answer.first();
                        if (answer.content == "exit") break;
                        item_buy = items.find(i => i.id == answer.content.trim().replace("pick>",""));
                        if (!item_buy) {
                            msg.channel.send("item not found");
                        } else {
                            referer_mode = "items";
                            mode = "transaction";
                            break;
                        }
                    }
                    if (answer.content == "exit") break;
                }
            } else if (mode = "transaction") {
                await msg.channel.send(`${member.getName()} bought 1 ${item_buy.name}`);
                mode = referer_mode;
            }
        }
        return msg.channel.send(`Arigathank, ${member.getName()}!~`);
    }
}
module.exports = new Command(data)