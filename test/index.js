'use strict';
var assert = require('assert');
var gutil = require('gulp-util');
var recess = require('../');

describe('gulp-recess', function () {
	describe('index', function () {

		it('should lint valid CSS', function (done) {
			var stream = recess();
			var called = 0;

			stream.on('data', function (d) {
				assert(d.hasOwnProperty('recess')); // exists
				assert(d.recess.success === true); // it passed
				// FRAGILE: changes in recess could change these:
				assert(d.recess.status === 'Perfect!');
				assert(d.recess.failureCount === 0);
				assert(d.recess.results.length === 0);
				called++;
			});

			stream.on('end', function () {
				assert(called === 1);
				done();
			});

			stream.write(new gutil.File({
				path: 'fixture.css',
				contents: new Buffer('.test-less{font-size:14px;background-color:green;}')
			}));
			stream.end();
		});

		it('should lint invalid CSS', function (done) {
			var stream = recess();
			var called = 0;

			stream.on('data', function (d) {
				assert(d.hasOwnProperty('recess')); // exists
				assert(d.recess.success === false); // it failed
				// FRAGILE: changes in recess could change these:
				assert(d.recess.status === 'Busted');
				assert(d.recess.failureCount > 0);
				assert(d.recess.results.length > 0);
				called++;
			});

			stream.on('end', function () {
				assert(called === 1);
				done();
			});

			stream.write(new gutil.File({
				path: 'fixture-invalid.css',
				contents: new Buffer('#test{background-color:green;font-size:0px;}')
			}));
			stream.end();
		});

		it('should handle LESS parse errors', function (done) {
			var stream = recess();
			var called = 0;

			stream.on('data', function (d) {
				assert(d.hasOwnProperty('recess') === false); // doesn't exist
				called++;
			});

			stream.on('error', function (err) {
				called++;
				assert(called === 1);
				assert.strictEqual(err.message, '.woops is undefined');
				done();
			});

			stream.write(new gutil.File({
				path: 'fixture.less',
				contents: new Buffer('div {\n.woops\n}')
			}));
			stream.end();
		});

	});
});
