const fs = require('fs')
module.exports = (type, content) => {
    return new Promise(resolve => {
        let now = Date.now();
        // fs.writeFileSync('logs/'+type+'/'+now+'.txt',content,{encoding:'utf8'});
        console.log(content);
        resolve(now);
    })
}
