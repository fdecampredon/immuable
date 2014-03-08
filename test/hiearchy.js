/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');

test('hiearchy update', function (t) {
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
    
    t.test('base', function (t) {
        var result = immuable(source);
    
        t.notEqual(source.address, result.address, 'should have cloned child object');
        t.deepEqual(source, result, 'object should be equivalent');
        t.ok(source.address, 'child should have an update function');
        t.ok(Object.isFrozen(result.address), 'child should be frozen');
        t.end();
    });
    
    
    t.test('update', function (t) {
        var result = immuable(source, function (value) {
            t.notEqual(result, value, 'the top level object should have been updated');
            t.notEqual(result.address, value.address, 'the object that have been updated should have changed');  
            t.equal(value.address, updatedAddress, 'the new child object should be the result of update');
            t.equal(result.car, value.car, 'child objects that does not have changed should not have been updated');
            t.end();
        }), 
        updatedAddress = result.address.update({phonenumber: '2234232523'});
    });
    
    t.test('multipe parents', function (t) {
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
        var result = immuable(root, function(value) {
            t.equal(value.obj1.child, value.obj2.child, 'instance should still be the same after update');
            t.equal(value.obj1.child, updatedChild, 'child instance should be the same that updare result');
            t.notEqual(result.obj1, value.obj1, 'should have created a new instance for each object updated');
            t.notEqual(result.obj2, value.obj2, 'should have created a new instance for each object updated');
            t.equal(result.obj2.obj3, value.obj2.obj3, 'object that has not been updated should remain the same');
            t.end();
        });
        t.equal(result.obj1.child, result.obj2.child, 
                'a same occurence of an object in source should result in ' + 
                'the same occurence in the immuable hiearchy');
        
        
        var updatedChild = result.obj1.child.update({
            foo: 'bar'
        });
        
        
    });
    
});