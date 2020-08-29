const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const PixivAppApi = require("pixiv-app-api");
const pixivImg = require("pixiv-img");
const pixiv = new PixivAppApi(process.env.PIXIV_EMAIL, process.env.PIXIV_PASSWORD, {
    camelcaseKeys: true,
})
const fetch = require('node-fetch');
const data = {
    caller: "pixiv",
    cd: 5,
    description: "Interact with Pixiv",
    nsfw: false,
    help: "",
    enable: true,
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        if (!params[1]) return;
        switch (params[1]) {
            case 's':
            case 'search':
                if (!params[2]) return;
                params[0] = "";
                params[1] = "";
                let ks = params.join(" ").trim();
                let waiter = await msg.channel.send('bé đang tìm, onii-san, onee-san đợi bé một tẹo nhé .______.');
                await pixiv.login()
                let auth = pixiv.auth;
                let illusts = [];
                let json = await pixiv.searchIllust(ks);
                if (json && json.illusts) {
                    illusts = illusts.concat(json.illusts);
                    while (pixiv.hasNext()) {
                        let json = await pixiv.next();
                        if (json && json.illusts) {
                            illusts = illusts.concat(json.illusts);
                        }
                    };
                }
                // Find most popular illustration
                if (illusts && illusts.length > 0) {
                    let most_popular = await new Promise(res => {
                        let mostPopular = [];
                        let maxView = 0;
                        let index = 0;
                        for (let i = 0; i < illusts.length; i++) {
                            if (illusts[i].totalView > maxView) {
                                maxView = illusts[i].totalView;
                                index = i;
                                mostPopular = [];
                                mostPopular.push(illusts[i]);
                            } else if (illusts[i].totalView === maxView) {
                                mostPopular.push(illusts[i]);
                                if (mostPopular.length > 5) {
                                    mostPopular.shift();
                                }
                            }
                        }
                        res(mostPopular);
                    })
                    let ran = Math.floor(Math.random() * most_popular.length);
                    let first = most_popular[ran];
                    console.log(first.imageUrls.squareMedium);
                    let img = await fetch(first.imageUrls.squareMedium,{headers: {'Referer':'http://www.pixiv.net/'}});
                    img = await img.buffer();
                    await waiter.delete();
                    await msg.channel.send(new Discord.MessageAttachment(img));
                } else {
                    await waiter.edit('w(ﾟДﾟ)w Bé không tìm được!');
                }
                break;
            default:
                break;
        }
    }
}

module.exports = new Command(data)