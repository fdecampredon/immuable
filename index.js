/*global Map : true*/

    
'use strict';

var _create = require('./lib/create'),
    set = require('./lib/set'),
    del = require('./lib/delete'),
    Map = require('./lib/shim').Map;

/**
 * transform a hierchy of objects into 'immuable' objects
 * @params {object} target the target to make 'immubale', this object will be 'frozen' after it receive the immuable data
 */
function create(target) {
    if (typeof target !== 'object') {
        throw new TypeError('target must be an object, given : ' + target);
    }
    
    var session = new Map();
    var result = _create(target, session);
    session.clear();
    return result; 
}

module.exports = {
    create: create,
    set: set,
    'delete': del
};