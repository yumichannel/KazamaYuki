class Member {
    constructor(data) {
        this.user_id = data.user_id || null;
        this.name = data.name || null;
        this.suffix = data.suffix || "san";
        this.sex = data.sex || null;
        this.race = data.race || null;
        this.level = data.level || 1;
        this.exp = data.exp || 0;
        this.exp_max = 0;
        this.balance = data.balance || 0;
        this.last_atd = data.last_atd || null;
        this.regis_from = data.regis_from || null;
        this.process = {
            sync: false,
            levelup: false
        }
    }
    /** Return custom name has suffix. Ex: yui-chan */
    getName() {
        return this.name+"-"+this.suffix;
    }
}

function getRequireExp(level) {
    return 10 * level;
}

function calculateXP(member) {
    let over_xp = 0;
    while(true) {
        if (member.exp >= member.exp_max) {
            member.exp -= member.exp_max
            member.level++;
            member.exp_max = getRequireExp(member.level);
        } else {
            break;
        }
    }
    return member;
}

module.exports = {
    Member: Member,
    getRequireExp: getRequireExp,
    calculateXP: calculateXP
}