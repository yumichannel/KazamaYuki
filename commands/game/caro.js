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
        let size = 6
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
                        msg.channel.send(render(map),{code:true}).then(m => {
                            mapId = m.id
                        })
                    }else{
                        map = check(map,x,y,nowp.type)
                        msg.channel.fetchMessage(mapId).then(m => {
                            m.delete().then(m2 => {
                                m2.channel.send(render(map),{code:true}).then(m3 => {
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
            case "map":
                msg.channel.send(render(caroGame.get(msg.guild.id).table),{code:true})
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
        function isWin(arr = [], symbol, h, c){
            return checkRow(arr,symbol,h,c) || checkColumn(arr,symbol,h,c) || checkCross1(arr,symbol,h,c) || checkCross2(arr,symbol,h,c)
        }
        
        function checkCross1(arr = [], symbol, h, c){
            let i = h;
            let j = c;
            let head = false;
            let tail = false;
            let count = 0;
            while(i != -1 && j!=-1){
                if(arr[i][j] == symbol){
                    count++;
                }else{
                    if(arr[i][j] != 0){
                        head = true
                    }
                }
                i--;
                j--;
            }
            i = h;
            j = c;
            while(i != size && j != size){
                if(arr[i][j] == symbol){
                    count++;
                }else{
                    if(arr[i][j] != 0){
                        tail = true
                        break
                    }
                }
                i++
                j++;
            }
            if(head || tail){
                if(count-1 >= 5) return true
            }
            if(!head && !tail){
                if(count-1 >=4) return true
            }
            return false
        }

        function checkCross2(arr = [], symbol, h, c){
            let i = h;
            let j = c;
            let head = false;
            let tail = false;
            let count = 0;
            while(i != -1 && j != size){
                if(arr[i][j] == symbol){
                    count++;
                }else{
                    if(arr[i][j] == 0){
                        head = false
                    }else{
                        head = true
                    }
                }
                i--;
                j++;
            }
            i = h;
            j = c;
            while(i != size && j != -1){
                if(arr[i][j] == symbol){
                    count++;
                }else{
                    if(arr[i][j] == 0){
                        tail = false
                    }else{
                        tail = true
                    }
                }
                i++;
                j--;
            }
            if(head || tail){
                if(count-1 >= 5) return true
            }
            if(!head && !tail){
                if(count-1 >=4) return true
            }
            return false
        }

        function checkRow(arr = [], symbol, h, c){
            let i = c;
            let head = false;
            let tail = false;
            let count = 0;
            while(i != -1){
                if(arr[h][i] == symbol){
                    count++;
                }else{
                    if(arr[h][i] != 0){
                        head = true;
                        break;
                    }
                }
                i--
            }
            i = c;
            while(i != size){
                if(arr[h][i] == symbol){
                    count++;
                }else{
                    if(arr[h][i] != 0){
                        tail = true;
                        break;
                    }
                }
                i++
            }
            if(head || tail){
                if(count-1 >= 5) return true
            }
            if(!head && !tail){
                if(count-1 >=4) return true
            }
            return false
        }

      
        function checkColumn(arr = [], symbol, h, c){
            let i = h;
            let head = false;
            let tail = false;
            let count = 0;
            while(i != -1){
                if(arr[i][c] == symbol){
                    count++;
                }else{
                    if(arr[i][c] != 0){
                        head = true;
                        break;
                    }
                }
                i--
            }
            i = h;
            while(i != size){
                if(arr[i][c] == symbol){
                    count++;
                }else{
                    if(arr[i][c] != 0){
                        tail = true;
                        break;
                    }
                }
                i++
            }
            if(head || tail){
                if(count-1 >= 5) return true
            }
            if(!head && !tail){
                if(count-1 >= 4) return true
            }
            return false
        }

        // function isWin(map = [],symbol,h,c){
        //     let arr1, arr2, arr3, arr4
        //     arr1 = map[h]
        //     arr2 = map.map(a => {
        //         return a[c]
        //     })
        //     arr3 = getCross1(map,h,c)
        //     map.map(row => {
        //         return row.reverse()
        //     })
        //     arr4 = getCross1(map,h,size-1-c)
        //     map.map(row => {
        //         return row.reverse()
        //     })
        //     if(hasContinue(arr1,symbol,h,c) || hasContinue(arr2,symbol,h,c) 
        //         || hasContinue(arr3,symbol,h,c) || hasContinue(arr4,symbol,h,c)){
        //         return true
        //     }
        //     return false
        //     // console.log(arr1,arr2,arr3,arr4);
        //     return false;
        // }

        /* A check array function but i keep it  */
        // function hasContinue(arr = [],symbol){
        //     console.log(arr)
        //     let head = 0
        //     let tail = 0
        //     let count = 0
        //     let len = arr.length
        //     for(let i = 0; i < len; i++){
        //         if(arr[i]==0){
        //             head = 0
        //             count = 0
        //         }else{
        //             if(arr[i]==symbol){
        //                 count++
        //             }else{
        //                 head = -1;
        //                 count = 0;
        //             }
        //             if(i+1<len){
        //                 if(arr[i+1]==0){
        //                     tail = 0
        //                     if((head==-1 && count>=5) || (head==0 && count>=4)){
        //                         // console.log(arr[i],head,tail,count,1)
        //                     }
        //                 }else{
        //                     if(arr[i+1]==symbol){
        //                         if((head==-1 && count>=4) || (head==0 && count>=3)){
        //                             //  console.log(arr[i],head,tail,count,2)
        //                         }
        //                     }else{
        //                         if(count>=5){
        //                             //  console.log(arr[i],head,tail,count,3)
        //                         }
        //                     }
        //                 }
        //             }
        //         }
                
        //         console.log(arr[i],head,tail,count)
        //     }                                                                    
        // }
        // function getCross1(arr,h,c){
        //     let temp = []
        //     if(h>=c){
        //         let hs = h - c
        //         let cs = 0
        //         for(let i = hs; i < 6; i++){
        //             if(cs < 6){
        //                 temp.push(arr[i][cs])
        //                 cs++
        //             }
        //         }
        //     }else{
        //         let cs = c - h
        //         for(let i = 0; i < 6; i++){
        //             if(cs < 6){
        //                 temp.push(arr[i][cs]);
        //                 cs++
        //             }
        //         }
        //     }
        //     return temp
        // }

        function endGame(){
            myGame.playing = false
            myGame.players = []
        }

        function render(map){
            let table = "";
            let hmax = map.length
            let cmax = map[0].length
            for(let i=0;i<=hmax;i++){
                for(let j=0;j<=cmax;j++){
                    if(i==0 && j==0){
                        table += "0\t";
                    }
                    if(i==0 && j!=0){
                        if(j==cmax){
                            table += j+"\n"
                        }else{
                            table += `${j}  `
                        }
                    }
                    if(i!=0 && j==0){
                        table += `${i}\t`
                    }
                    if(i!=0 && j!=0){
                        if(j==cmax){
                            table += map[i-1][j-1] + "\n" 
                        }else{
                            table += map[i-1][j-1] + "  "
                        }
                    }
                }
            }
            return table
        }
    }
}
module.exports = new Command(data)
