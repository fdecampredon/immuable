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
            updatedResult = value;
        }), 
        updatedResult,
        updatedAddress = result.address.update({phonenumber: '2234232523'});
        
        t.notEqual(result, updatedResult, 'the top level object should have been updated');
        t.notEqual(result.address, updatedResult.address, 'the object that have been updated should have changed');  
        t.equal(updatedResult.address, updatedAddress, 'the new child object should be the result of update');
        t.equal(result.car, updatedResult.car, 'child objects that does not have changed should not have been updated');
        t.equal(updatedResult.car.update({year: '2004'}), updatedResult.car, 'the object that have been updated should have changed');
        t.equal(updatedAddress, updatedResult.address, 'after the first update, child objects should update their new parent');
        t.end();    
    });
    
    /*t.test('multipe parents', function (t) {
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
            updateResult = value;
        }), updateResult;
        t.equal(result.obj1.child, result.obj2.child, 
                'a same occurence of an object in source should result in ' + 
                'the same occurence in the immuable hiearchy');
        
        var updatedChild = result.obj1.child.update({
            foo: 'bar'
        });
        t.equal(updateResult.obj1.child, updateResult.obj2.child,updatedChild, 'instance should still be the same after update');
        t.equal(updateResult.obj1.child, updatedChild, 'child instance should be the same that updare result');
        t.notEqual(result.obj1, updateResult.obj1, 'should have created a new instance for each object updated');
        t.notEqual(result.obj2, updateResult.obj2, 'should have created a new instance for each object updated');
        t.notEqual(result.obj2, updateResult.obj2, 'should have created a new instance for each object updated');
        t.equal(result.obj2.obj3, updatedChild.obj2.obj3, 'object that has not been updated should remain the same');
        
    });*/
    
});