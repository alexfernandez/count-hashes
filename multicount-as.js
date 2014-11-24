'use strict';

require('prototypes');
var hash = require('./hash.js');
var numCPUs = require('os').cpus().length;
var cluster = require('cluster');

var max = 0;
var received = 0;
var totalAs = 0;


function readArgs(args)
{
	if (args.length != 1)
	{
		console.error('Invalid number of parameters');
		return usage();
	}
	max = parseInt(args[0]);
	if (!max)
	{
		console.error('Invalid max %s', args[0]);
		return usage();
	}
	var slice = max / numCPUs;
	var index = 0;
	for (var id in cluster.workers)
	{
		var worker = cluster.workers[id];
		worker.on('message', reduce);
		worker.send({
			min: index * slice,
			max: (index + 1) * slice,
		});
		index += 1;
	}
}

function reduce(message)
{
	console.log('Received %j', message);
	if (!message || !message.total)
	{
		return console.error('Invalid message received in master: %s', message);
	}
	received += 1;
	totalAs += message.total;
	if (received != numCPUs)
	{
		return;
	}
	var estimated = max * 64 / 16;
	var diff = Math.abs(estimated - totalAs);
	var percent = 100 * diff / totalAs;
	console.log('Total As: %s, estimated %s, difference %s (%s %)', totalAs, estimated, diff, percent.toFixed(2));
	process.exit('0');
}

function usage()
{
	console.error('Usage: %s %s [max]', process.argv[0], process.argv[1]);
	console.error('Compute the number of letters a in the hashes of all numbers from 1 to max');
	process.exit(0);
}

if (cluster.isMaster)
{
	for (var i = 0; i < numCPUs; i++)
	{
		cluster.fork();
	}
	readArgs(process.argv.splice(2));
}
else
{
	process.on('message', function(message)
	{
		if (!message || !message.max)
		{
			return console.error('Invalid message received: %j', message);
		}
		console.log('Computing from %s to %s', message.min, message.max);
		var total = hash.countHashesIn(message.min, message.max);
		console.log('Computed from %s to %s: %s', message.min, message.max, total);
		process.send({
			total: total,
		});
	});
}

