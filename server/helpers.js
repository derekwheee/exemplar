fs = require('fs');
const config = require('./config');

exports.icon = function(path) {
    try {
        return fs.readFileSync(`${config.STATIC_PATH}/icons/min/${path}.svg`, { encoding : 'utf-8' });
    } catch (err) {
        return '';
    }
};