'use strict';

var immuable = require('../'),
    test = require('tape');


test('create', function (t) {
    t.test('arguments check', function (t) {
        t.throws(function () {
            immuable.create(1);
        }, TypeError, 'it should throw if a non object is passed as parameter');   
        t.end();  
    });
    
    t.test('basic', function (t) {
        var instances = [];
        function A() {
            instances.push(this);
        }

        var source = new A();
        source.foo = 'bar';

        var result = immuable.create(source);

        t.notEqual(source, result, 'it should not return the same object');
        t.deepEqual(source, result, 'target and result should be equivalents');
        t.equal(Object.getPrototypeOf(source), Object.getPrototypeOf(result), 'proto should be conserved');
        t.deepEqual([source, result], instances, 'constructor should have been called');
        t.true(Object.isFrozen(result), 'result should be frozen');
        t.end();  
    });
    
    t.test('hierarchy', function (t) {
        var source = { 
            firstName: 'francois', 
            lastName: 'de Campredon',
            address: {
                country: 'France',
                street: '12 rue du charolais',
                town: 'Paris',
                zip: '75012'
            },
            car: {
                name: 'Megane',
                constructor: 'Renault'
            }
        };
        
        var result = immuable.create(source);
    
        t.notEqual(source.address, result.address, 'should have cloned child object');
        t.deepEqual(source, result, 'object should be equivalent');
        t.ok(source.address, 'child should have an update function');
        t.ok(Object.isFrozen(result.address), 'child should be frozen');
        
        
        var obj1 = {},
            obj2 = {
                obj3: {}
            },
            child = {},
            root = {
                obj1: obj1,
                obj2: obj2
            };
        
        obj1.child = obj2.child = child;
        result= immuable.create(root);
        t.equal(result.obj1.child, result.obj2.child, 
                'a same occurence of an object in source should result in ' + 
                'the same occurence in the immuable hiearchy');
        t.end();
    });
});