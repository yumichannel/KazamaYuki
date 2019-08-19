module.exports = class CaroGame{
    constructor(guildId){
        this.guildId = guildId
        this.playing = false
        this.players = []
        this.table = [
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0],
            [0,0,0,0,0,0]
        ]
    }
    setGuildId(guildId){
        this.guildId = guildId
    }
    getGuildId(){
        return this.guildId
    }
}