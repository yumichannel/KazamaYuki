const config = require('./config')
module.exports = class CustomData{
    constructor(data){
        this.guild_id=data.guild_id
        this.wc_msg=data.wc_msg || []
        this.wc_channel = data.wc_channel || null
        this.err_msg=data.err_msg || []
        this.prefix=data.prefix || config.prefix
        this.lang=data.lang || "en"
    }
    /** @param {String[]} welcomeMsg set Greeting Message Handle*/
    setWelcome(welcomeMsg){
        this.welcomeMsg=welcomeMsg
    }
    /** @param {String[]} errorMsg set Error Message Handle*/
    setError(errorMsg){
        this.errorMsg=errorMsg
    }
    /** @param {string} lang set default language*/
    setLang(lang){
        if(config.language.findIndex(l=>l==lang)==-1){
            return false
        }else{
            this.lang=lang
            return true
        }
    }
    /** @param {string} prefix set new prefix*/
    setPrefix(prefix){
        this.prefix=prefix
    }
}