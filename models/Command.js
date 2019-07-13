module.exports = class Command{
    constructor(data){
        this.caller = data.caller
        this.category = "uncategorized"
        this.description = data.description || ""
        this.nsfw = data.nsfw || false
        this.help = data.help || "Nothing"
        this.hide = data.hide || false
        this.cd = data.cd || 1
        this.run = data.run || function(){return}
    }
    setCategory(cate){
        this.category = cate
    }
}