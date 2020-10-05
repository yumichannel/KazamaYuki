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

class Shop {
    constructor(data) {
        this.list = null;
    }
}

class ShopItem {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || null;
        this.price = data.price || null;
        this.rank = data.rank || null;
        this.category = data.category_id || null;
        this.sale = {
            price: data.sale_price || null
        };
        this.require = {
            rank: data.user_rank || null,
            level: data.user_level || null
        }
        this.desc = data.description || null
    }
}

class ShopCategory {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name || null;
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

function formatPrice(price) {
    let _p = price + "";
    return _p.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = {
    Member: Member,
    Shop: Shop,
    ShopItem: ShopItem,
    ShopCategory: ShopCategory,
    getRequireExp: getRequireExp,
    calculateXP: calculateXP,
    formatPrice: formatPrice
}