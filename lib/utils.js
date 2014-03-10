'use strict';

//borowing arrayProto an slice
var arrProto = Array.prototype,
    slice = Function.call.bind(arrProto.slice);


function reduce(target, callback, baseObj) {
    if (!Array.isArray(target)) {
        target = Object.keys(target);
    } 
    return target.reduce(callback, baseObj);
}

function each(target, callback, thisObj) {
    if (!Array.isArray(target)) {
        target = Object.keys(target);
    } 
    return target.forEach(callback, thisObj);
}

//simply assign all the own enumerable property from a list of object to a given one
function assign(target, sources) {
    if (!Array.isArray(sources)) {
        sources = slice(arguments, 1);
    }

    sources.forEach(function (object) {
        reduce(object, function(target, key) {
            target[key] = object[key];
            return target;
        }, target);       
    });
    return target;
}

//create an object with the same prototype and call the 'constructor' prototype on that object
function cloneBase(target) {
    var proto = Object.getPrototypeOf(target),
        result = Object.create(proto);
    if (proto.hasOwnProperty('constructor')) {
        proto.constructor.call(result);
    }
    return result;
}

//a clone function that also clone the prototype and call the constructor on the result
function clone(target) {
    return assign(cloneBase(target), target);
}



module.exports = {
    assign: assign,
    clone: clone,
    cloneBase: cloneBase,
    each: each,
    reduce: reduce,
    slice: slice
};