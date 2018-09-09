const path = require('path');

function resolve(...name) {
    return path.resolve(__dirname, ...name)
}

function isEnStrikethrough(text){
    const regExp = /^([a-z0-9]+-)*([a-z0-9]+)$/;
    return regExp.test(text);
}


module.exports = {
    resolve,
    isEnStrikethrough
};