/*jshint node: true*/
'use strict';

var immuable = require('../'),
    test = require('tape');


test('callback', function (t) {
    
    var source = {},
        callBackResult,
        result = immuable(source, function (newObject, oldObject) {
            callBackResult = newObject;
            t.equal(result, oldObject, 'it should pass as second parameter the previous version of the model');
        });
    
    t.equal( result.update({ foo: 'bar' }), callBackResult, 'it should pass as first parameter the result of update');
    t.end();
});