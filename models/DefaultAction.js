const actionList = {
    'di ngu' : 'sleep'
};

function _do(action = '', ...params){
    if (actionList[action]) {
        `${actionList[action]}`(params);
    }
};

function sleep(params = []){
    console.log('sleep')
};

function wakeup(params = []){
    console.log('wakeup');
    
};

module.exports = { actionList, _do };