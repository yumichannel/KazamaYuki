const Discord = require('discord.js');
const Command = require('../../models/Command');
const CaroGame = require('../../models/CaroGame');
const caroMessage = require('../../utils/caro_message');
const data = {
    caller: "caro",
    cd: 0,
    help: "join, start, enjoy",
    run: function(msg=new Discord.Message,params=[]){
        let caroGame = msg.client.caroGame
        let myGame
        if(!params || params.length == 0) return
        switch (params[1]) {
            case "start":
                if(caroGame.has(msg.guild.id)) return caroMessage(msg,"game_start")
                myGame = new CaroGame();
                myGame.setGuildId(msg.guild.id)
                caroGame.set(myGame.getGuildId(),myGame)
                caroMessage(msg,"join")
                break;
            case "join":
                if(!caroGame.has(msg.guild.id)) return caroMessage(msg,"game_not_start")
                myGame = caroGame.get(msg.guild.id)
                if(myGame.playing) return caroMessage(msg,"match_start")
                if(myGame.players.length == 2) return  msg.channel.send('Max 2 players');
                let newp = {
                    id: msg.author.id,
                    name: msg.member.displayName,
                    type: myGame.players.length+1
                }
                myGame.players.push(newp)
                msg.channel.send("",{embed:{description:`*${newp.name}* joined caro game with symbol \`${newp.type}\``}})
                break;
            case "match":
                if(!caroGame.has(msg.guild.id)) return caroMessage(msg,"game_not_start")
                myGame = caroGame.get(msg.guild.id)
                if(myGame.players.length < 2) return caroMessage(msg,"need_player")
                if(myGame.playing) return caroMessage(msg,"match_start")
                myGame.playing = true
                caroGame.set(myGame.guildId,myGame)
                let players = myGame.players
                let nowp = players.shift()
                let map = myGame.table
                let mapId = null
                msg.channel.send(`\`Match start! *${nowp.name}* go first\``)
                let collector = msg.channel.createMessageCollector(
                    m => {
                        return m && nowp.id == m.author.id
                    }
                )
                collector.on('collect',message => {
                    if(message.content == "caro end match"){
                        collector.stop()
                        endGame()
                        msg.channel.send(`Match stop`)
                    }
                    if(!message.content.startsWith('check')) return;
                    let arr = message.content.replace('check',"").trim().split(" ")
                    let x = arr[0]
                    let y = arr[1]
                    if(x== 0 || y == 0) return msg.channel.send('`check again`');
                    if(x > 6 || y > 6) return msg.channel.send('`check again`');
                    console.log(`${nowp.name} checks ${x} ${y}`)
                    if(mapId == null){
                        map = check(map,x,y,nowp.type)
                        msg.channel.send(map,{code:true}).then(m => {
                            mapId = m.id
                        })
                    }else{
                        map = check(map,x,y,nowp.type)
                        msg.channel.fetchMessage(mapId).then(m => {
                            m.delete().then(m2 => {
                                m2.channel.send(map,{code:true}).then(m3 => {
                                    mapId = m3.id
                                })
                            })
                        })
                    }
                    if(isWin(map,nowp.type,x-1,y-1)){
                        collector.stop()
                        endGame()
                        return msg.channel.send(`${nowp.name} win`)
                    }
                    players.push(nowp);
                    nowp = players.shift();
                })
                break;
            case "stat":
                console.log(caroGame.get(msg.guild.id))
                break
            default:
                break;

        }

        function check(map,x,y,symbol){
            if(map[x-1][y-1] == 0){
                map[x-1][y-1] = symbol
            }
            return map;
        }
        function isWin(map = [],symbol,h,c){
            let arr1, arr2, arr3, arr4
            arr1 = map[h]
            arr2 = map.map(a => {
                return a[c]
            })
            arr3 = getCross1(map,h,c)
            map.map(row => {
                return row.reverse()
            })
            arr4 = getCross1(map,h,6-c)
            map.map(row => {
                return row.reverse()
            })
            if(hasContinue(arr1,symbol) || hasContinue(arr2,symbol) 
                || hasContinue(arr3,symbol) || hasContinue(arr4,symbol)){
                return true
            }
            return false
        }

        function hasContinue(arr = [],symbol){
            const len = arr.length
            let count = 0
            for(let i = 0; i < len; i++){
                if(arr[i]==symbol){
                    count++;
                }else{
                    if(count>=4){
                        return true
                    }else{
                        count = 0
                    }
                }
            }
            return false
        }

        function getCross1(arr,h,c){
            let temp = []
            if(h>=c){
                let hs = h - c
                let cs = 0
                for(let i = hs; i < 6; i++){
                    if(cs < 6){
                        temp.push(arr[i][cs])
                        cs++
                    }
                }
            }else{
                let cs = c - h
                for(let i = 0; i < 6; i++){
                    if(cs < 6){
                        temp.push(arr[i][cs]);
                        cs++
                    }
                }
            }
            return temp
        }

        function endGame(){
            myGame.playing = false
            myGame.players = []
        }
    }
}
module.exports = new Command(data)
