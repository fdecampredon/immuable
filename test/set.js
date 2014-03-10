'use strict';

var immuable = require('../'),
    test = require('tape');

test('set', function (t) {
    
    t.test('arguments check', function (t) {
        t.throws(function () {
            immuable.set(1);
        }, TypeError, 'it should throws if a non object is passed as first parameter');
        
        t.throws(function () {
            immuable.set({}, 1);
        }, TypeError, 'it should throws is passed as seconds parameter');
        
        t.end();
    });
    
    t.test('basic', function (t) {
        var source = immuable.create({ foo: 'bar', foo1: true}),
            result = immuable.set(source, {foo1: 'bar', foo2: true, child: { hello: 'world'}});
        t.notEqual(source, result, 'it should create a new object');
        t.deepEqual(result, {
            foo : 'bar', 
            foo1: 'bar', 
            foo2: true,
            child: { 
                hello: 'world'
            }
        }, 'set should set the object passed as parameter');
        t.true(Object.isFrozen(result), 'result should be frozen');
        t.true(Object.isFrozen(result.child), 'child objet  passed in set should be immuable');
        t.end();
    });
    
});




