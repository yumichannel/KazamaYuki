const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const snek = require('snekfetch');
module.exports = function(url) {
    return new Promise(async (resolve, reject) => {
        let response;
        let _dom;
        let result;
        try {
            response = await snek.get(url);
            _dom = new JSDOM(response.body.toString());
            result = _dom.window.document.querySelectorAll('.item-section a.yt-uix-tile-link.yt-ui-ellipsis.yt-ui-ellipsis-2.yt-uix-sessionlink.spf-link');
            if (result && result.length !== 0) {
                resolve(result);
            } else {
                reject('');
            }
        } catch (e) {
            reject('');
        }
    });
}
