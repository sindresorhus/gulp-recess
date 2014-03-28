'use strict';
var gutil = require('gulp-util');
var through = require('through2');
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
			return cb();
		}

		if (file.isStream()) {
			this.emit('error', new gutil.PluginError('gulp-recess', 'Streaming not supported'));
			return cb();
		}

		options.contents = file.contents.toString();

		recess(file.path, options, function (err, data) {
			if (err) {
				this.emit('error', new gutil.PluginError('gulp-recess', err.join('\n')));
			}

			// only log on failure
			if (data[0].output[1].indexOf('Busted') !== -1) {
				this.emit('error', new gutil.PluginError('gulp-recess', '\n' + data[0].output.join('\n')));
			}

			this.push(file);
			cb();
		}.bind(this));
	});
};
