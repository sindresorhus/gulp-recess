'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var recess = require('./index');
var out = process.stdout.write.bind(process.stdout);

it('should lint CSS with RECESS', function (cb) {
	var stream = recess();

	process.stdout.write = function (str) {
		if (/STATUS: Busted/.test(gutil.colors.stripColor(str))) {
			assert(true);
			process.stdout.write = out;
			cb();
		}
	};

	stream.write(new gutil.File({
		path: 'fixture.css',
		contents: new Buffer('.test-less{font-size:14px;background-color:green;}')
	}));

	stream.write(new gutil.File({
		path: 'fixture-invalid.css',
		contents: new Buffer('#test{background-color:green;font-size:0px;}')
	}));
});
