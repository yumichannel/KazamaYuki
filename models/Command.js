module.exports = class Command{
    constructor(data){
        this.caller = data.caller;
        this.category = "uncategorized";
        this.description = data.description || "";
        this.nsfw = data.nsfw || false;
        this.help = data.help || "Nothing";
        this.enable = data.enable || false;
        this.cd = data.cd || 1;
        this.translate = data.translate || null;
        this.run = data.run || null;
        this.alias = data.alias
    }
    setCategory(cate){
        this.category = cate
    }
};
