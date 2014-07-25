'use strict';
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var chalk = require('chalk');
var recess = require('recess');

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
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-recess', 'Streaming not supported'));
			cb();
			return;
		}

		options.contents = file.contents.toString();

		recess(file.path, options, function (err, results) {
			if (err) {
				err.forEach(function (el) {
					this.emit('error', new gutil.PluginError('gulp-recess', el));
				}, this);
				this.push(file);
				return;
			}

			var data = results[0]; // we only linted one file
			var failureCount = 0;

			if (data.output.length > 2) {
				var match = /([0-9]+) fail/i.exec(chalk.stripColor(data.output[2]));

				if (match) {
					failureCount = parseInt(match[1]);
				}
			}

			file.recess = {
				success: (data.output[1].indexOf('Busted') === -1),
				status: chalk.stripColor(data.output[1]).replace(/status: /i,'').trim(),
				failureCount: failureCount,
				results: data.output.slice(3),
				errors: data.errors,
				opt: options
			};

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
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-recess', 'Streaming not supported'));
			cb();
			return;
		}

		var recessDataForThisFile = file.recess;
		var filename = path.relative(file.cwd, file.path);

		if (recessDataForThisFile && !recessDataForThisFile.success) {
			console.log(' [' + chalk.green('gulp-recess') + '] ' + filename + ': ' + chalk.red(recessDataForThisFile.status) + ' ' + recessDataForThisFile.failureCount+' failures');
			
			if (!options.minimal) {
				console.log(file.recess.results.join('\n'));
			}

			if (!options.hasOwnProperty('fail') || options.fail) {
				this.emit('error', new gutil.PluginError('gulp-recess', filename + ': ' + file.recess.status + ' ' + recessDataForThisFile.failureCount+' failures'));
			}
		}

		this.push(file);
		cb();
	});
};
