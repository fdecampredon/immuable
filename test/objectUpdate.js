/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');

test('object update', function (t) {
    t.throws(function () {
        immuable({}).update(1);
    }, TypeError, 'it should throw if a non object, and non function is passed as parameter');
    var source = immuable({});
    
    t.ok(source.update, 'immuable ould produce an object with an update function');
    t.ok(source.keys(source).indexOf('update') === -1, 'update should not be enumerable');
    
    source = immuable({ foo: 'bar', foo1: true});
        
    var result = source.update({foo1: 'bar', foo2: true, child: { hello: 'world'}});

    t.ok(result.update, 'update should produce an object with an update function');
    t.notEqual(source, result, 'should create a new object');
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




