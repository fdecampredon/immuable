
'use strict';

var utils = require('./utils'),
    cloneBase = utils.cloneBase,
    reduce = utils.reduce;


// immuable
// ========

function create(target, session) {
    var result = session.get(target);
    if (!result) {
        
        if (Array.isArray(result)) {
            result = createArray(result);
        } else {
            result = cloneBase(target);
        }
        session.set(target, result);
        reduce(target, function (result, key) {
            var value = target[key];
            if (typeof value === 'object') {
                value = create(value, session);
            }
            result[key] = value;
            return result;
        }, result);
        
        Object.freeze(result);
    }
    return result;
}




module.exports = create;