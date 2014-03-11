'use strict';

var vm = require('vm'),
    utils = require('./utils'),
    slice = utils.slice;


var context = { arr: '' };

vm.runInNewContext('arr = Array', context, 'array.js');
var ImmutableArray = context.arr;


function defineProperties(target, properties) {
    return Object.defineProperties(target,
       Object.keys(properties).reduce(function (propertiesDesc, key) {
            propertiesDesc[key] = {
                value : properties[key], 
                configurable: true, 
                writable: true
            };
            return propertiesDesc;
        }, {}));
}

defineProperties(ImmutableArray.prototype, {
    concat: function () {
        var args = slice(arguments)
    }
    
    reverse: function reverse() {
        return this.slice().reverse();
    },

    splice: function splice() {
        var args = slice(arguments),
            clone = this.slice();
        
        return Object.freeze(this.slice.apply(clone, args));
    },

    sort: function sort(sortFunc) {
        return this.slice().sort(sortFunc);
    },

    push: function push() {
        var args = slice(arguments),
            clone = this.slice();
        
        return Object.freeze(this.push.apply(clone, args));
    },

    pop: function pop() {
        return Object.freeze(this.slice(0, this.length -1));
    },

    shift: function shift() {
        return Object.freeze(this.slice(1));
    },

    unshift: function shift() {
        var args = slice(arguments),
            clone = this.slice();
        
        return Object.freeze(this.push.apply(clone, args));
    },
    
     "concat", "reverse", "shift", "unshift", "slice", "splice", "sort", "filter", "forEach", "some", "every", "map", "indexOf", "lastIndexOf", "reduce", "reduceRight"


});