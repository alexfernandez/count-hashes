'use strict';

require('prototypes');
var crypto = require('crypto');
var testing = require('testing');


exports.hashAndCountAs = function(integer)
{
	var hash = crypto.createHash('sha256');
	hash.update(integer);
	var digest = hash.digest('hex');
	return countAsIn(digest);
};

function countAsIn(string)
{
	var count = 0;
	while (string.contains('a'))
	{
		count ++;
		string = string.substringFrom('a');
	}
	return count;
}

function testCount(callback)
{
	testing.assertEquals(countAsIn('aaaaa'), 5, 'Invalid count for 5 as', callback);
	testing.assertEquals(countAsIn('bbbaccca'), 2, 'Invalid count for 2 as', callback);
	testing.success(callback);
}

// run tests if invoked directly
if (__filename == process.argv[1])
{
	testCount(testing.show);
}
