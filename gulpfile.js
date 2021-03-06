var gulp = require('gulp'),
	gutil=require('gulp-util'),
	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	//uglify = require('gulp-uglify'),
	concat= require('gulp-concat');
let uglify = require('gulp-uglify-es').default;
var env,
	coffeeSourses,
	jsSources,
	sassSources,
	htmlSources, 
	jsonSources,
	outputDir, 
	sassConfigStyle

	env = process.env.NODE_ENV || 'development'

	if(env==='development'){
		outputDir="builds/development/";
		sassConfigStyle ='expanded';
	}else{
		outputDir="builds/production/";
		sassConfigStyle='compressed';
	}

 	coffeeSourses=['components/coffee/tagline.coffee'];
 	jsSources =[
		'components/scripts/rclick.js',
		'components/scripts/pixgrid.js',
		'components/scripts/tagline.js',
		'components/scripts/template.js'
	];
 	sassSources = ['components/sass/style.scss'];
	htmlSources =[outputDir +'*html']
	jsonSources =[outputDir +'js/*.json'];

	gulp.task('coffee', function(){
		gulp.src(coffeeSourses)
			.pipe(coffee({bare : true})
				.on('error', gutil.log))
			.pipe(gulp.dest('components/scripts'))
	});

	gulp.task('js', function(){
		gulp.src(jsSources)
			.pipe(concat('script.js'))
			.pipe(browserify())
			.pipe(gulpif(env==='production', uglify()))
			.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
			.pipe(gulp.dest(outputDir + 'js'))
			.pipe(connect.reload())

	})

	gulp.task('compass', function(){
		gulp.src(sassSources)
			.pipe(compass({
				config_file: 'components/sass/'+ sassConfigStyle +'-config.rb',
				css: outputDir + 'css',
				sass: 'components/sass',
				image: outputDir + 'images'
				
			})
			.on('error', gutil.log))
			.pipe(gulp.dest(outputDir + 'css')) 
			.pipe(connect.reload())
	})

	gulp.task('watch', function(){
		gulp.watch(coffeeSourses,['coffee']);
		gulp.watch(jsSources,['js']);
		gulp.watch('components/sass/*.scss',['compass']);
		gulp.watch(htmlSources,['html']);
		gulp.watch(jsonSources,['json']);
	})

	gulp.task('connect',function(){
		connect.server({
			root: outputDir,
			livereload: true
		})

	})

	gulp.task('html', function(){
		gulp.src(htmlSources)
			.pipe(connect.reload())
	})
	gulp.task('json', function(){
		gulp.src(outputDir + 'js/*.json')
			.pipe(connect.reload())
	})

	gulp.task('default',['html','json', 'coffee','js','compass', 'connect', 'watch'])