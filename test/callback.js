/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');


test('callback', function (t) {
    
    var source = {},
        result = immuable(source, function (newObject, oldObject) {
            t.equal( updateResult, newObject, 'it should pass as first parameter the result of update');
            t.equal(result, oldObject, 'it should pass as second parameter the previous version of the model');
            t.end();
        }),
        updateResult = result.update({ foo: 'bar' });
    
   
});