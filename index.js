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
    
    // Utils
    // =====
    
    // Set shim
    // --------
    
    var Set;
    if (typeof Set  === 'undefined') {
        Set = function() {
            this.objects = [];
        };
        Set.prototype.add = function(obj) {
            this.objects.push(obj);
        };
        Set.prototype.has = function(obj) {
            return this.objects.indexOf(obj) !== -1;
        };
        Set.prototype.delete = function (obj) {
            var index = this.objects.indexOf(obj);
            if (index !== -1) {
                this.objects.splice(index, 1);
            }
        };
    }
    
    // Map shim
    // --------
    
    var Map;
    if (typeof Map === 'undefined') {
        Map = function() {
            this.keys = [];
            this.values = [];
        };
        Map.prototype.set = function(key, value) {
            this.keys.push(key);
            this.values.push(value);
        };
        Map.prototype.get = function(key) {
            return this.values[this.keys.indexOf(key)];
        };
        Map.prototype.clear = function () {
            this.keys.length = 0;
            this.values.length = 0;
        };
    }
    
    // setImmediate shim
    // -----------------
    
    var setImmediate, clearImmediate;
    if (typeof setImmediate === 'undefined') {
        setImmediate = setTimeout;
        clearImmediate = clearTimeout;
    }
    
    
    // update
    // ======
    
    var updateSession = new Set();
    
    function updateObject(updates, session) {
        /*jshint validthis:true*/
        if (typeof updates !== 'object') {
            throw new TypeError('updates must be an object, given : ' + updates);
        }
        
        session = session || new Map();
        
        var result = clone(this);
        
        session.set(this, result);
        reduce(updates, function (result, key) {
            var value = updates[key];
            if (typeof value === 'object' && result[key] !== value && !updateSession.has(value)) {
                value = _immuable(value, {
                    instance: result,
                    field: key
                }, session);
            }
            result[key] = value;
            return result;
        }, result);
        
        
        updateSession.add(result);
        Object.freeze(defineProps(result, { 
            update: updateObject, 
            __parents: this.__parents.map(function (parentDescriptor) {
                var updates = {};
                updates[parentDescriptor.field] = result;
                return { 
                    instance: parentDescriptor.instance.update(updates), 
                    field: parentDescriptor.field 
                };
            })
        }));
        updateSession.delete(result);
        
        return result;
    }
    
    // immuable
    // ========
    
    function _immuable(target, parent, session) {
        var result = session.get(target);
        if (!result) {
            result = cloneBase(target);
            session.set(target, result);
            reduce(target, function (result, key) {
                var value = target[key];
                if (typeof value === 'object') {
                    value = _immuable(value, {
                        instance: result,
                        field: key
                    }, session);
                }
                result[key] = value;
                return result;
            }, result);
            
            Object.freeze( defineProps(result, { 
                update: updateObject,
                __parents: []
            }));
        }
        result.__parents.push(parent);
        return result;
    }
  
    
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
        var session = new Map(),
            timeout;
        var result = _immuable(target, {
            //a fake parent instance that just call the root function
            instance: {
                update: function (data) {
                    var oldValue = result;
                    result = data.data;
                    if (callback) {
                        clearImmediate(timeout);
                        timeout = setImmediate(function () {
                            callback(result, oldValue);
                        });
                    }
                }
            },
            field: 'data'
        }, session);
        session.clear();
        return result; 
    }
    
    return immuable;
}));