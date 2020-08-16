const Discord = require('discord.js');
const Command = require('../../models/Command');
const CaroGame = require('../../models/CaroGame');
const caroMessage = require('../../utils/caro_message');
const aton = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8
}
const ntoa = [
    null, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
]
const ntoe = [
    ':zero:', ':one:', ':two:', ':three:', ':four:', ':five:', ':six:', ':seven:', ':eight:'
]
const ctoe = [
    null, ':x:', ':o:'
]
const data = {
    caller: "caro",
    cd: 0,
    help: "join, start, enjoy",
    enable: true,
    run: function (bot = new Bot({}),msg = new Discord.Message, params = []) {
        let caroGame = msg.client.caroGame
        let myGame
        let size = 8
        if (!params || params.length == 0) return
        switch (params[1]) {
            case "start":
                if (caroGame.has(msg.guild.id)) return caroMessage(msg, "game_start")
                myGame = new CaroGame();
                myGame.setGuildId(msg.guild.id)
                caroGame.set(myGame.getGuildId(), myGame)
                caroMessage(msg, "join")
                break;
            case "join":
                if (!caroGame.has(msg.guild.id)) return caroMessage(msg, "game_not_start")
                myGame = caroGame.get(msg.guild.id)
                if (myGame.playing) return caroMessage(msg, "match_start")
                if (myGame.players.length == 2) return msg.channel.send('Max 2 players');
                let newp = {
                    id: msg.author.id,
                    name: msg.member.displayName,
                    type: myGame.players.length + 1
                }
                myGame.players.push(newp)
                msg.channel.send("", {embed: {description: `*${newp.name}* joined caro game with symbol ${ctoe[newp.type]}`}})
                break;
            case "match":
                if (!caroGame.has(msg.guild.id)) return caroMessage(msg, "game_not_start")
                myGame = caroGame.get(msg.guild.id)
                if (myGame.players.length < 2) return caroMessage(msg, "need_player")
                if (myGame.playing) return caroMessage(msg, "match_start")
                myGame.playing = true
                caroGame.set(myGame.guildId, myGame)
                let players = myGame.players
                let ran = Math.floor(Math.random() * 2);
                let nowp
                if (ran == 0) {
                    nowp = players.pop()
                }
                if (ran == 1) {
                    nowp = players.shift()
                }
                let map = myGame.table
                let mapId = null
                msg.channel.send(`\`Match start! The first is ...\``).then(m => {
                    setTimeout(() => {
                        m.edit(`\`Match start! The first is ... *${nowp.name}*\``)
                    }, 3000);
                })
                let collector = msg.channel.createMessageCollector(
                    m => {
                        return m && nowp.id == m.author.id
                    }
                )
                collector.on('collect', message => {
                    if (message.content == "Force end match") {
                        collector.stop()
                        endGame()
                        msg.channel.send(`Match stop`)
                    }
                    let checkPattern = /^[A-z]{1}-[1-8]{1}$/
                    if (!message.content.match(checkPattern)) return
                    let arr = message.content.replace('check', "").trim().split("-")
                    let x = aton[arr[0].toUpperCase()]
                    let y = arr[1]
                    if (x == 0 || y == 0) return msg.channel.send('`check again`');
                    if (x > size || y > size) return msg.channel.send('`check again`');
                    console.log(`${nowp.name} checks ${x} ${y}`)
                    if (mapId == null) {
                        map = check(map, x, y, nowp.type)
                        msg.channel.send(render(map), {code: false}).then(m => {
                            mapId = m.id
                        })
                    } else {
                        map = check(map, x, y, nowp.type)
                        msg.channel.fetchMessage(mapId).then(m => {
                            m.delete().then(m2 => {
                                m2.channel.send(render(map), {code: false}).then(m3 => {
                                    mapId = m3.id
                                })
                            })
                        })
                    }
                    if (isWin(map, nowp.type, x - 1, y - 1)) {
                        collector.stop()
                        endGame()
                        return msg.channel.send(`${nowp.name} win`)
                    }
                    players.push(nowp);
                    nowp = players.shift();
                })
                break;
            case "map":
                msg.channel.send(render(caroGame.get(msg.guild.id).table))
                break
            default:
                break;
        }

        function check(map, x, y, symbol) {
            if (map[x - 1][y - 1] == 0) {
                map[x - 1][y - 1] = symbol
            }
            return map;
        }

        function isWin(arr = [], symbol, h, c) {
            return checkRow(arr, symbol, h, c) || checkColumn(arr, symbol, h, c) || checkCross1(arr, symbol, h, c) || checkCross2(arr, symbol, h, c)
        }

        function checkCross1(arr = [], symbol, h, c) {
            let i = h;
            let j = c;
            let head = false;
            let tail = false;
            let count = 0;
            while (i != -1 && j != -1) {
                if (arr[i][j] == symbol) {
                    count++;
                } else {
                    if (arr[i][j] != 0) {
                        head = true
                    }
                    break;
                }
                i--;
                j--;
            }
            i = h;
            j = c;
            while (i != size && j != size) {
                if (arr[i][j] == symbol) {
                    count++;
                } else {
                    if (arr[i][j] != 0) {
                        tail = true
                    }
                    break;
                }
                i++
                j++;
            }
            if (head || tail) {
                if (count - 1 >= 5) return true
            }
            if (!head && !tail) {
                if (count - 1 >= 4) return true
            }
            return false
        }

        function checkCross2(arr = [], symbol, h, c) {
            let i = h;
            let j = c;
            let head = false;
            let tail = false;
            let count = 0;
            while (i != -1 && j != size) {
                if (arr[i][j] == symbol) {
                    count++;
                } else {
                    if (arr[i][j] != 0) {
                        head = true
                    }
                    break;
                }
                i--;
                j++;
            }
            i = h;
            j = c;
            while (i != size && j != -1) {
                if (arr[i][j] == symbol) {
                    count++;
                } else {
                    if (arr[i][j] == 0) {
                        tail = true
                    }
                    break;
                }
                i++;
                j--;
            }
            if (head || tail) {
                if (count - 1 >= 5) return true
            }
            if (!head && !tail) {
                if (count - 1 >= 4) return true
            }
            return false
        }

        function checkRow(arr = [], symbol, h, c) {
            let i = c;
            let head = false;
            let tail = false;
            let count = 0;
            while (i != -1) {
                if (arr[h][i] == symbol) {
                    count++;
                } else {
                    if (arr[h][i] != 0) {
                        head = true;
                    }
                    break;
                }
                i--
            }
            i = c;
            while (i != size) {
                if (arr[h][i] == symbol) {
                    count++;
                } else {
                    if (arr[h][i] != 0) {
                        tail = true;
                    }
                    break;
                }
                i++
            }
            if (head || tail) {
                if (count - 1 >= 5) return true
            }
            if (!head && !tail) {
                if (count - 1 >= 4) return true
            }
            return false
        }

        function checkColumn(arr = [], symbol, h, c) {
            let i = h;
            let head = false;
            let tail = false;
            let count = 0;
            while (i != -1) {
                if (arr[i][c] == symbol) {
                    count++;
                } else {
                    if (arr[i][c] != 0) {
                        head = true;
                    }
                    break;
                }
                i--
            }
            i = h;
            while (i != size) {
                if (arr[i][c] == symbol) {
                    count++;
                } else {
                    if (arr[i][c] != 0) {
                        tail = true;
                    }
                    break;
                }
                i++
            }
            if (head || tail) {
                if (count - 1 >= 5) return true
            }
            if (!head && !tail) {
                if (count - 1 >= 4) return true
            }
            return false
        }

        function endGame() {
            myGame.playing = false
            myGame.players = []
        }

        function render(map) {
            let table = "";
            let hmax = map.length
            let cmax = map[0].length
            for (let i = 0; i <= hmax; i++) {
                for (let j = 0; j <= cmax; j++) {
                    if (i == 0 && j == 0) {
                        table += ':no_entry_sign:';
                    }
                    if (i == 0 && j != 0) {
                        if (j == cmax) {
                            table += `${ntoe[j]}` + "\n"
                        } else {
                            table += `${ntoe[j]}`
                        }
                    }
                    if (i != 0 && j == 0) {
                        table += `:regional_indicator_${ntoa[i].toLowerCase()}:`
                    }
                    if (i != 0 && j != 0) {
                        if (j == cmax) {
                            table += (ctoe[map[i - 1][j - 1]] || ':stop_button:') + "\n"
                        } else {
                            table += ctoe[map[i - 1][j - 1]] || ':stop_button:'
                        }
                    }
                }
            }
            return table
        }
    }
}
module.exports = new Command(data)
