const Discord = require('discord.js');
const Command = require('../../models/Command');
const data = {
    caller: "rng",
    cd: 1,
    enable: true,
    run: function (bot = new Bot({}),msg=new Discord.Message,params=[]){
        var x = params.slice(1)
        var arr
        var res =''
        switch(x[0]){
            case '-s':
                try {
                    arr = x[1].split('-')
                    res = proc(arr[0],arr[1])
                    msg.channel.send(`Result: ${res}`)
                } catch (error) {
                    console.log("rng error:\n"+error)
                }
                return
            case '-m':
                try {
                    arr = x[2].split('-')
                    while(x[1]!=0){
                        res+=proc(arr[0],arr[1])+" "
                        x[1]--
                    }
                    msg.channel.send(`Result: ${res}`)
                } catch (error) {
                    console.log("rng error:\n"+error)
                }
                return
            default:
                return msg.channel.send("Wrong syntax!")
        }

        function proc(a,b){
            a = parseInt(a)
            b = parseInt(b)
            return Math.floor(Math.random()*(b+1-a))+a
        }
    }
}
module.exports = new Command(data)
