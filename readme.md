# [gulp](http://gulpjs.com)-recess [![Build Status](https://travis-ci.org/sindresorhus/gulp-recess.svg?branch=master)](https://travis-ci.org/sindresorhus/gulp-recess)

> Lint CSS and LESS with [RECESS](https://github.com/twitter/recess)

*Issues with the output should be reported on the RECESS [issue tracker](https://github.com/twitter/recess/issues).*


## Install

```bash
$ npm install --save-dev gulp-recess
```


## Usage

```js
var gulp = require('gulp');
var recess = require('gulp-recess');
var less = require('gulp-less');

gulp.task('default', function () {
	gulp.src('src/app.css')
		.pipe(recess())
		.pipe(less())
		.pipe(gulp.dest('dist'));
});
```


## API

The `compress` and `compile` options from RECESS are intentionally missing. Separate tasks like [gulp-csso](https://github.com/ben-eb/gulp-csso) and [gulp-less](https://github.com/plus3network/gulp-less) will do a much better job.

### recess(options)

```js
// default options
includePath: []				// Additional paths to look for `@import`'ed LESS files.
strictPropertyOrder: true	// Complains if not strict property order
noIDs: true					// Doesn't complain about using IDs in your stylesheets
noJSPrefix: true			// Doesn't complain about styling .js- prefixed classnames
noOverqualifying: true		// Doesn't complain about overqualified selectors (ie: div#foo.bar)
noUnderscores: true			// Doesn't complain about using underscores in your class names
noUniversalSelectors: true	// Doesn't complain about using the universal * selector
zeroUnits: true				// Doesn't complain if you add units to values of 0
```


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
