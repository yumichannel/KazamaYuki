class Member {
    constructor(data) {
        this.user_id = data.user_id || null;
        this.name = data.name || null;
        this.sex = data.sex || null;
        this.race = data.race || null;
        this.level = data.level || 1;
        this.exp = data.exp || 0;
        this.exp_max = data.exp_max || 100;
        this.balance = data.balance || 0;
        this.process = {
            sync: false,
            levelup: false
        }
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