const gulp = require('gulp')
const uglify = require('gulp-uglify')
const babel = require('gulp-babel')
const cleanCSS= require('gulp-clean-css')
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const transform = require('vinyl-transform')
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const imagemin = require('gulp-imagemin');
const util = require('util')
const templatePrefixer = require('./gulpUtils/templatePrefixer.js')
const jsonLoader =  require('./gulpUtils/jsonLoader.js')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin');
  var sitemap = require('gulp-sitemap');
  const indexIsSoSpecial = require('./gulpUtils/indexIsSoSpecial')
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

gulp.task('serve', ()=> {
    browserSync.init({
        server: "./dist/"
    });
    gulp.watch('src/js/*.js',['compress']).on('change',browserSync.reload)
    gulp.watch('src/styles/*.scss',['clean-css']).on('change',browserSync.reload)
    // gulp.watch('src/js/*.js',['browserify']).on('change',browserSync.reload)
    // gulp.watch('*').on('change',browserSync.reload)
    gulp.watch(['src/js/main.js','src/js/transitions.js','src/js/history.js','serviceWorkers.js'],['compress','main-bundle']).on('change',browserSync.reload)
    gulp.watch(['src/content/templates/*.html','src/content/contentJson/*.json','src/content/contentJson/**/*.json','src/content/contentJson/**/**.json'],['jsonhtml']).on('change',browserSync.reload)
    gulp.watch('src/content.html',['indexhtml']).on('change',browserSync.reload)
})


gulp.task('compress', ()=>
        gulp.src('src/js/*.js')
        // .pipe(concat('bundle.js'))
        .pipe(babel({
            presets: ["@babel/preset-env"],
        })).on('error', function(e){
            console.log(e);})
         // .pipe(uglify().on('error', function(e){
            // console.log(e);}))
        .pipe(gulp.dest('./dist/js'))
);
gulp.task('main-bundle', ()=>
        gulp.src(['src/js/main.js','src/js/history.js','serviceWorkers.js'])
        .pipe(concat('bundle.js'))
        .pipe(babel({
            presets: ["@babel/preset-env"],
        })).on('error', function(e){
            console.log(e);})
         // .pipe(uglify().on('error', function(e){
            // console.log(e);}))
        .pipe(gulp.dest('./dist/js'))
);

// DONT MIND THIS FOR NOW, MIGHT USE FOR BROWSERIFY LATER
// gulp.task('browserify', function () {
//   // return browserify({entries: './src/js/main1.js', debug: true})
//   //       .transform("babelify", {presets: ["@babel/preset-env"]})
//   //       .bundle()
//   //       .pipe(source('main1.js'))
//   //       .pipe(buffer())
//   //       // .pipe(uglify())
//   //       .pipe(gulp.dest('./dist/'));;
//    gulp.src('src/js/*.js')
//          .pipe(babel({
//             presets: ['@babel/env']
//         }))
//          .pipe(uglify().on('error', function(e){
//             console.log(e);}))
//         .pipe(gulp.dest('./dist/'))
// });


gulp.task('clean-css',()=>
  gulp.src('src/styles/*.scss')
  // .pipe(concat('bundle.css'))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
  // .pipe(cleanCSS())
  .pipe(gulp.dest('./dist/'))
  )

gulp.task('imagemin', () =>
    gulp.src('src/assets/images/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images/'))
);


gulp.task('fonts', () =>
    gulp.src('src/assets/fonts/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/fonts/'))
);



gulp.task('html',()=>
  gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
  )

gulp.task('jsonhtml',()=>
  gulp.src(['src/content/contentJson/*.json','src/content/contentJson/**.json','src/content/contentJson/***/*.json','src/content/contentJson/**/**/**/*.json'],
    {base: './src/content/contentJson/'}) 
  .pipe(jsonLoader())
  .pipe(rename({extname:'.html'}))
  .pipe(gulp.dest('dist/content'))
  )
gulp.task('htmlutils',()=>
  gulp.src('src/content/utils/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist/utils'))
  )
gulp.task('indexhtml',()=>
  gulp.src('src/content/*.html')
  .pipe(indexIsSoSpecial())
  .pipe(gulp.dest('dist/'))
  )

 
gulp.task('sitemap', function () {
    gulp.src('dist/**/**/*.html', {
            read: false
        })
        .pipe(sitemap({
            siteUrl: 'https://autonomy.laeeto.com'
        }))
        .pipe(gulp.dest('dist/'));
});
// Remember to put imagemin later on in
gulp.task('default',['main-bundle','serve', 'fonts', 'html','indexhtml','htmlutils','jsonhtml','compress','clean-css','sitemap'])


