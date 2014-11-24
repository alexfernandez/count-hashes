'use strict';

require('prototypes');
var hash = require('./hash.js');


function countHashesUpTo(max)
{
	var totalAs = hash.countHashesIn(0, max);
	var estimated = max * 64 / 16;
	var diff = Math.abs(estimated - totalAs);
	var percent = 100 * diff / totalAs;
	console.log('Total As: %s, estimated %s, difference %s (%s %)', totalAs, estimated, diff, percent.toFixed(2));
}

function readArgs(args)
{
	if (args.length != 1)
	{
		console.error('Invalid number of parameters');
		return usage();
	}
	var max = parseInt(args[0]);
	if (!max)
	{
		console.error('Invalid max %s', args[0]);
		return usage();
	}
	countHashesUpTo(max);
}

function usage()
{
	console.error('Usage: %s %s [max]', process.argv[0], process.argv[1]);
	console.error('Compute the number of letters a in the hashes of all numbers from 1 to max');
	process.exit(0);
}

readArgs(process.argv.splice(2));

