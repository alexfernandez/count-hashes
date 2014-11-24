'use strict';

require('prototypes');
var crypto = require('crypto');
var testing = require('testing');


exports.countHashesIn = function(from, to)
{
	var total = 0;
	for (var i = from; i < to; i++)
	{
		total += hashAndCountAs(i);
	}
	return total;
};

function hashAndCountAs(integer)
{
	var hash = crypto.createHash('sha256');
	hash.update(String(integer));
	var digest = hash.digest('hex');
	return countAsIn(digest);
}

function testHash(callback)
{
	var count = hashAndCountAs(5);
	testing.assertEquals(count, 4, 'Not enough as', callback);
	count = exports.hashAndCountAs(1);
	testing.assertEquals(count, 5, 'Too many as', callback);
	testing.success(callback);
}

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

function test(callback)
{
	testing.run([
		testHash,
		testCount,
	], callback);
}

// run tests if invoked directly
if (__filename == process.argv[1])
{
	test(testing.show);
}

