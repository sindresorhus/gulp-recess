'use strict';
var es = require('event-stream');
var gutil = require('gulp-util');
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

	return es.map(function (file, cb) {
		options.contents = file.contents.toString();

		recess(file.path, options, function (err, data) {
			if (err) {
				return cb(err);
			}

			gutil.log('gulp-recess:\n' + data[0].output.join('\n'));
			cb(null, file);
		});
	});
};
