'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var recess = require('recess');
var chalk = require('chalk');
var path = require('path');
var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-recess';

// prevent RECESS from reading files
recess.Constructor.prototype.read = function () {
	setImmediate(function () {
		this.data = this.options.contents;
		this.parse();
	}.bind(this));
};

module.exports = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}

		options.contents = file.contents.toString();

		recess(file.path, options, function (err, data) {
			if (err) {
				err.forEach(function (el) {
					this.emit('error', new PluginError(PLUGIN_NAME, el));
				}, this);
				this.push(file);
				return;
			}

			var d = data[0]; // we only linted one file

			var failureCount = 0;
			if (d.output.length > 2) {
				failureCount = chalk.stripColor(d.output[2]);
				var m = /([0-9]+) fail/i.exec(failureCount);
				if (m && m.length > 0) {
					failureCount = parseInt(m[1]);
				}
			}

			file.recess = {
				success: (d.output[1].indexOf('Busted') === -1),
				status: chalk.stripColor(d.output[1]).replace(/status: /i,'').trim(),
				failureCount: failureCount,
				results: d.output.slice(3), // .map(function (i) {return chalk.stripColor(i).trim().replace('\n\n', '\n');}), // remove CRLF
				errors: d.errors,
				opt: options
			};

			console.log(file.recess);

			this.push(file);
			cb();
		}.bind(this));
	});
};

module.exports.reporter = function (options) {
	options = options || {};

	return through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
			return cb();
		}

		var r = file.recess;
		var filename = path.relative(file.cwd, file.path);

		if (r && !r.success) {
			console.log(' ['+chalk.green(PLUGIN_NAME)+'] '+filename+': '+chalk.red(r.status)+' '+r.failureCount+' failures');
			if (!options.minimal) {
				console.log(file.recess.results.join('\n'));
			}
			if (!options.continueOnError) {
				// TODO: wait until on('end') to avoid stopping here?
				this.emit('error', new PluginError(PLUGIN_NAME, filename+': '+file.recess.status+' '+r.failureCount+' failures'));
			}
		}

		this.push(file);
		cb();
	});
};
