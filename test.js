'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var chalk = require('chalk');
var recess = require('./index');
var out = process.stdout.write.bind(process.stdout);

it('should lint CSS with RECESS', function (cb) {
	var stream = recess();

	stream.on('data', function () {});

	stream.on('error', function (err) {
		assert(/STATUS: Busted/.test(chalk.stripColor(err.message)));
		cb();
	});

	stream.write(new gutil.File({
		path: 'fixture.css',
		contents: new Buffer('.test-less{font-size:14px;background-color:green;}')
	}));

	stream.write(new gutil.File({
		path: 'fixture-invalid.css',
		contents: new Buffer('#test{background-color:green;font-size:0px;}')
	}));
});
