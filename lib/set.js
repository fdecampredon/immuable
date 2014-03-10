/*global Map : true*/
     

'use strict';
var utils = require('./utils'),
    clone = utils.clone,
    reduce = utils.reduce,
    create = require('./create'),
    Map = require('./shim').Map;

function set(immuable, updates) {
    if (typeof immuable !== 'object') {
        throw new TypeError('immuable must be an object, given : ' + immuable);
    }
    if (typeof updates !== 'object') {
        throw new TypeError('updates must be an object, given : ' + updates);
    }
    
    var result = clone(immuable),
        session = new Map();
    
    session.set(immuable, result);
    reduce(updates, function (result, key) {
        var value = updates[key];
        if (typeof value === 'object' && result[key] !== value) {
            value = create(value, session);
        }
        result[key] = value;
        return result;
    }, result);
    
    session.clear();
    Object.freeze(result);
    return result;
}

module.exports = set;

