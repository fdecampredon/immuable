/*global define, module */

(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.immuable = factory();
    }
}(this, function () {
    'use strict';
    
    
    // Utils
    // =====
    
    //borowing arrayProto an slice
    var arrProto = Array.prototype,
        slice = Function.call.bind(arrProto.slice);
    
    
    function reduce(target, callback, baseObj) {
        if (!Array.isArray(target)) {
            target = Object.keys(target);
        } 
        return target.reduce(callback, baseObj);
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
    
    function defineProps(target, properties, options) {
        if (typeof options === 'undefined') {
            options  = {};
        }
        return Object.defineProperties(target, 
            reduce(properties, function (descriptors, key) {
                descriptors[key] = assign({ value: properties[key] }, options);
                return descriptors;
            }, {})
        );
    }
    
 
    
    
    // update
    // ======
    
    function updateObject(updates) {
        /*jshint validthis:true*/
        
        if (typeof updates === 'function') {
            var copy = Object.create(clone(this));
            updates(copy);
            updates = copy;
        } else if (typeof updates !== 'object') {
            throw new TypeError('blabla');
        }
        
        var result = reduce(updates, function (result, key) {
            var value = updates[key];
            if (typeof value === 'object') {
                //TODO code duplication
                value = immuable(value, function (data) {
                    var updates = {};
                    updates[key] = data;
                    result.update(updates);
                });
            }
            result[key] = value;
            return result;
        }, clone(this));
        
        return Object.freeze(defineProps(result, { update: this.update }));
    }
    
  
    
    // immuable
    // ========
    
    /**
     * transform a hierchy of objects into 'immuable' objects
     * @params {object} target the target to make 'immubale', this object will be 'frozen' after it receive the immuable data
     * @params {(object, object)} callback a callback function called with the new version of the object when an update is made on the chain 
     */
    function immuable(target, callback) {
        if (typeof target !== 'object') {
            throw new TypeError('target must be an object, given : ' + target);
        }
        
        if (typeof callback !== 'undefined' && typeof callback !== 'function') {
            throw new TypeError('callback must be an function, given : ' + target);
        }
        
        var result = reduce(target, function (result, key) {
            var value = target[key];
            if (typeof value === 'object') {
                value = immuable(value, function (data) {
                    var updates = {};
                    updates[key] = data;
                    result.update(updates);
                });
            }
            result[key] = value;
            return result;
        }, cloneBase(target));
    
        
        return Object.freeze( defineProps(result, { 
            update: function update(updates) {
                var oldValue = result;
                result = updateObject.call(result, updates);
                if (callback) {
                    callback(result, oldValue);
                }
                return result;
            }
        }));
    }
    
    return immuable;
}));