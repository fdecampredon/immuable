'use strict';
var utils = require('./utils'),
    clone = utils.clone,
    each = utils.each,
    slice = utils.slice;

function del(immuable, properties) {
    if (typeof immuable !== 'object') {
        throw new TypeError('immuable must be an object, given : ' + immuable);
    }
    
    if (!Array.isArray(properties)) {
        properties = slice(arguments, 1);
    }
    
    var result = clone(immuable);
    each(properties, function (key) {
        delete result[key];
    });
    Object.freeze(result);
    return result;
}

module.exports = del;

