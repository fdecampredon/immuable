/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');


test('immuable', function (t) {
    t.throws(function () {
        immuable(1);
    }, TypeError, 'it should throw if a non object is passed as parameter');
    
    t.test('with object passed as parameter', function (t) {
        var instances = [];
        function A() {
            instances.push(this);
        }

        var object = new A();
        object.foo = 'bar';

        var result = immuable(object);

        t.notEqual(object, result, 'it should not return the same object');
        t.deepEqual(object, result, 'target and result should be equivalents');
        t.equal(Object.getPrototypeOf(object), Object.getPrototypeOf(result), 'proto should be conserved');
        t.deepEqual([object, result], instances, 'constructor should have been called');
        t.true(Object.isFrozen(result), 'result should be frozen');
        t.end();     
    });
    
    t.test('with array passed as parameter', function (t) {
        t.end();
    });
    t.end();
    
});