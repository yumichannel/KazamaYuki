const Discord = require('discord.js');
const Command = require('../../models/Command');
const Bot = require('../../models/Bot');
const fs = require('fs');
const fetch = require("node-fetch");
const { JSDOM } = require('jsdom');
const data = {
    caller: "gfl",
    cd: 10,
    description: "wiki wrapper based on gfwiki.com",
    nsfw: false,
    help: [],
    enable: true,
    run: async function (bot = new Bot({}), msg = new Discord.Message, params = []) {
        switch (params[1]) {
            case "-s":
                let name = params[2];
            case "update":
                let update_msg = await msg.channel.send('Updating GFL database...');
                let gunList = {};
                let res = await fetch("https://en.gfwiki.com/wiki/T-Doll_Index");
                res = await res.text();
                let dom = new JSDOM(res);
                let gun_selector = dom.window.document.querySelectorAll('.card-bg-small');
                for (let i = 0; i < gun_selector.length; i++) {
                    try {

                        let url = gun_selector[i].querySelectorAll('.pad > a')[0].getAttribute('href');
                        let name = gun_selector[i].querySelectorAll('.pad > a')[0].getAttribute('title');
                        let name_id = name.split(" ").join("_");
                        gunList[name_id] = {
                            "name": name
                        };
                        console.log("Updating " + name);
                        let gun_fetch = await fetch("https://en.gfwiki.com" + url);
                        gun_fetch = await gun_fetch.text();
                        let gundom = (new JSDOM(gun_fetch)).window.document;
                        gunList[name_id].profile_image = gundom.querySelector(".dollprofileimage").getAttribute("src");
                        let stat = gundom.querySelectorAll(".stattabcontainer table");
                        let _temp = stat[0].querySelectorAll("td");
                        gunList[name_id].stat = {};
                        gunList[name_id].stat.hp = _temp[3].querySelector("[data-tdoll-stat-id=hpmaxwd]").textContent.trim();
                        gunList[name_id].stat.ammo = _temp[4].textContent.trim();
                        gunList[name_id].stat.ration = _temp[5].textContent.trim();
                        gunList[name_id].stat.damage = gundom.querySelector("[data-tdoll-stat-id=max_dmg]").textContent.trim();
                        gunList[name_id].stat.evasion = gundom.querySelector("[data-tdoll-stat-id=max_eva]").textContent.trim();
                        gunList[name_id].stat.evasion = gundom.querySelector("[data-tdoll-stat-id=max_acc]").textContent.trim();
                        gunList[name_id].stat.rof = gundom.querySelector("[data-tdoll-stat-id=max_rof]").textContent.trim();
                        gunList[name_id].stat.movespeed = gundom.querySelector("[data-tdoll-stat-id=mov]").textContent.trim();
                        let armor = gundom.querySelector("[data-tdoll-stat-id=max_armor]");
                        gunList[name_id].stat.armor = armor ? armor.textContent.trim() : 0;
                        let pen = gundom.querySelector("[data-tdoll-stat-id=penetration]");
                        gunList[name_id].stat.penetration = pen ? pen.textContent.trim() : 0;
                        let clipsize = gundom.querySelector("[data-tdoll-stat-id=clipsize]");
                        gunList[name_id].stat.clipsize = clipsize ? clipsize.textContent.trim() : 0;
                        let crit = gundom.querySelector("[data-tdoll-stat-id=crit]");
                        gunList[name_id].stat.crit = crit ? crit.textContent.trim() : 0;
                        let critdmg = gundom.querySelector("[data-tdoll-stat-id=critdmg]");
                        gunList[name_id].stat.critdmg = critdmg ? critdmg.textContent.trim() : 0;

                        gunList[name_id].obtain = {};
                        let obtain_normal = gundom.querySelector(".obtainflagcontainer .obtainflag.obtain-normal:not(.notpossible)");
                        let obtain_heavy = gundom.querySelector(".obtainflagcontainer .obtainflag.obtain-heavy:not(.notpossible)");
                        gunList[name_id].obtain.production = {
                            normal: obtain_normal ? 1 : 0,
                            heavy: obtain_heavy ? 1 : 0,
                            time: obtain_normal || obtain_heavy ? gundom.querySelectorAll(".obtainflagcontainer + b")[0].textContent : 'not craftable'
                        }
                        let obtain_drop = gundom.querySelector(".obtainflagcontainer .obtainflag.obtain-drop:not(.notpossible)");
                        gunList[name_id].obtain.drop = obtain_drop ? 1 : 0;
                        let obtain_reward = gundom.querySelector(".obtainflagcontainer .obtainflag.obtain-reward:not(.notpossible)");
                        gunList[name_id].obtain.reward = obtain_reward ? 1 : 0;

                        let skillform = gundom.querySelectorAll(".skillform");
                        skillform = skillform[skillform.length - 1];
                        gunList[name_id].skill = {}
                        gunList[name_id].skill.normal = skillform.querySelector("[data-skilldata-content=skilldata]").querySelector('td').textContent.trim();
                        let modskill = skillform.querySelector("[data-skilldata-content=skill2data]");
                        gunList[name_id].skill.mod = modskill ? modskill.querySelector('td').textContent.trim() : 'No mod skill';
                    } catch (err) {
                        console.log(err)
                        continue;
                    }
                }
                fs.writeFileSync("models/GFL_DB.json", JSON.stringify(gunList), { encoding: "utf8" });
                await update_msg.edit("Tactical dolls data up-to-date");
                break;
            default:
        }
    }
}
module.exports = new Command(data)