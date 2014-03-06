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

	var logOnSuccess = typeof options.logOnSuccess === 'boolean' ? options.logOnSuccess : true;
	delete options.logOnSuccess;

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

			if((data[0].errors && data[0].errors.length > 0) || logOnSuccess) {
				gutil.log('gulp-recess:\n' + data[0].output.join('\n'));
			}

			this.push(file);

			cb();
		}.bind(this));
	});
};
