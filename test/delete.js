'use strict';

var immuable = require('../'),
    test = require('tape');

test('set', function (t) {
    
    t.test('arguments check', function (t) {
        t.throws(function () {
            immuable.set(1);
        }, TypeError, 'it should throws if a non object is passed as first parameter');
        t.end();
    });
    
    t.test('basic', function (t) {
        var source = immuable.create({ foo: 'bar', foo1: true, foo2: 5}),
            result = immuable.delete(source, 'foo', 'foo2');
        t.notEqual(source, result, 'it should create a new object');
        t.deepEqual(result, { foo1: true }, 'it should delete the properties');
        
        
        source = immuable.create({ foo: 'bar', foo1: true, foo2: 5});
        result = immuable.delete(source, ['foo', 'foo2']);
        t.deepEqual(result, { foo1: true }, 'it should works with array or rest');
        
        t.end();
    });
    
});




