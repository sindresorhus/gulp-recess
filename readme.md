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

gulp.task('default', function () {
	return gulp.src('src/app.css')
		.pipe(recess())
		.pipe(recess.reporter())
		.pipe(gulp.dest('dist'));
});
```


## API

The `compress` and `compile` options from RECESS are intentionally missing. Separate tasks like [gulp-csso](https://github.com/ben-eb/gulp-csso) and [gulp-less](https://github.com/plus3network/gulp-less) will do a much better job.

### recess(options)

Run recess on each file

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
writes `.recess` object to each vinyl object
```js
{
success: true,				// `Boolean`: did it succeed?
status: 'Perfect!',			// Recess status
failureCount: 0,			// `int`: number of errors
results: [],				// array of recess failure details
errors: [],					// Recess errors
options: {},				// The options passed to recess
}
```

### recess.reporter(options)

Write the report on each failing file.  (Passing files write no output.)

```js
// default options
fail: true					// If true, it writes error event on failure
minimal: false				// If true, it only lists failure filenames omitting details
```


## License

[MIT](http://opensource.org/licenses/MIT) © [Sindre Sorhus](http://sindresorhus.com)
