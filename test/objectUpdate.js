/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');

test('object update', function (t) {
    t.throws(function () {
        immuable({}).update(1);
    }, TypeError, 'it should throw if a non object, and non function is passed as parameter');
    var object = immuable({});
    
    t.ok(object.update, 'immuable ould produce an object with an update function');
    t.ok(Object.keys(object).indexOf('update') === -1, 'update should not be enumerable');
    
    t.test('with object passed as parameter', function (t) {
        var object = immuable({ foo: 'bar', foo1: true}),
            result = object.update({foo1: 'bar', foo2: true, child: { hello: 'world'}});

        t.ok(result.update, 'update should produce an object with an update function');
        t.notEqual(object, result, 'should create a new object');
        t.deepEqual(result, {
            foo : 'bar', 
            foo1: 'bar', 
            foo2: true,
            child: { 
                hello: 'world'
            }
        }, 'update should merge the object passed as parameter');
        t.true(Object.isFrozen(result), 'result should be frozen');
        t.true(Object.isFrozen(result.child), 'child objet  passed in update should be immuable');
        t.end();
    });
    
    
    t.test('with function passed as parameter', function (t) {
        var object = immuable({ foo: 'bar', foo1: true}),
            result = object.update(function (target) {
                t.deepEqual({ foo: 'bar', foo1: true}, Object.getPrototypeOf(target), 
                            'should pass an object with proto equal to the original object');
                target.foo1 = 'bar';
                target.foo2 = true;
            });
        
        t.ok(result.update, 'update should produce an object with an update function');
        t.notEqual(object, result, 'should create a new object');
        t.deepEqual(result, {
            foo : 'bar', 
            foo1: 'bar', 
            foo2: true
        }, 'should retrieve all change made to the target and apply them to the copy of the object');
        t.true(Object.isFrozen(result), 'result should be frozen');
        t.end();
    });
});




