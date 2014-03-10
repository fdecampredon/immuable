/*global Set: true, Map : true*/

'use strict';

// Set shim
// --------


var Set;
if (typeof exports.Set  === 'undefined') {
    var Set = exports.Set;
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


module.exports = {
    Set: Set,
    Map: Map,
    setImmediate: setImmediate,
    clearImmediate: clearImmediate
};