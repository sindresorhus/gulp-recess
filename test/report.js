'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var recess = require('../');

var out = process.stdout.write.bind(process.stdout);

describe('gulp-recess', function () {
	describe('report', function () {
		var stdoutData = [];

		beforeEach(function () {
			stdoutData = [];
			process.stdout.write = function () {
				stdoutData.push(arguments);
			};
		});

		afterEach(function () {
			process.stdout.write = out; // put it back even if test fails
			stdoutData = null;
		});

		it('should lint valid CSS', function (done) {
			var stream = recess();
			var reporter = recess.reporter();

			reporter.on('finish', function () {
				assert(stdoutData.length === 0);
				done();
			});

			stream.pipe(reporter);

			stream.write(new gutil.File({
				path: 'fixture.css',
				contents: new Buffer('.test-less{font-size:14px;background-color:green;}')
			}));

			stream.end();
		});

		it('should lint invalid CSS', function (done) {
			var stream = recess();
			var reporter = recess.reporter({fail:false});
			var actualData;

			stream.on('data', function (data) {
				actualData = data;
			});

			reporter.on('finish', function () {
				process.stdout.write = out;
				assert(stdoutData.length > 0);
				done();
			});

			stream.pipe(reporter);

			stream.write(new gutil.File({
				path: 'fixture-invalid.css',
				contents: new Buffer('#test{background-color:green;font-size:0px;}')
			}));

			stream.end();
		});

		it('should lint invalid CSS and output minimal', function (done) {
			var stream = recess();
			var reporter = recess.reporter({fail:false, minimal:true});
			var actualData;

			stream.on('data', function (data) {
				actualData = data;
			});

			reporter.on('finish', function () {
				process.stdout.write = out;
				assert(stdoutData.length === 1);
				done();
			});

			stream.pipe(reporter);

			stream.write(new gutil.File({
				path: 'fixture-invalid.css',
				contents: new Buffer('#test{background-color:green;font-size:0px;}')
			}));

			stream.end();
		});

		it('should error on invalid CSS', function (done) {
			var stream = recess();
			var reporter = recess.reporter();

			reporter.on('error', function (err) {
				process.stdout.write = out;
				assert(err.message.indexOf('fixture-invalid.css') > -1);
				done();
			});

			stream.pipe(reporter);

			stream.write(new gutil.File({
				path: 'fixture-invalid.css',
				contents: new Buffer('#test{background-color:green;font-size:0px;}')
			}));

			stream.end();
		});
	});
});
