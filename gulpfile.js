//导入工具包 require('node_modules里对应模块')
const gulp = require('gulp');
const del = require('del');
const pump = require('pump');

const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

const distDev = './dist/dev';
const distBuild = './dist/build';

// 匹配
const glob = {
    lib: './src/js/@(lib|nls)/**/*', // lib + nls
    script: ['./src/js/!(lib|nls)/**/*', './src/js/*'], // 与上一个匹配为整个js目录
    media: './src/assets/@(video|audio)/**/*', // 视音频
    image: './src/assets/img/**/*.@(jpg|jpeg|png|git)', // 图片
    style: './src/style/**/*', // 样式
    html: './src/**/*.html', //html
};

// 参考vue，es6解析设置
const presets = [
    ['env', {
        'modules': false
    }],
    'stage-2'
];


gulp.task('dev', (cb) => {
    let move = [];
    for (const key in glob) {
        move.push(`move-${key}`)
    }
    $.sequence('clean-dev', move, 'server-dev')(cb);
});

// dev服务器
gulp.task('server-dev', ['watch'], () => {
    browserSync.init({
        server: {
            baseDir: distDev
        }
    });
});

// build服务器
gulp.task('server-build', () => {
    browserSync.init({
        server: {
            baseDir: distBuild
        }
    });
});


// 监听
gulp.task('watch', () => {

    // gulp.watch(path.html).on('change', reload);

    for (const key in glob) {
        gulp.watch(glob[key], [`move-${key}`]);
    }
});

// 移动html
gulp.task('move-html', () => 
    gulp.src(glob.html)
        .pipe($.changed(distDev))
        .pipe(gulp.dest(distDev))
        .pipe(reload({stream: true}))
);

// 移动css，仅处理main.less
gulp.task('move-style', ['stylelint'], () => {

    gulp.src('./src/style/main.less')
        .pipe($.cssUnit({
            type: 'px-to-rem',
            rootSize: 50,
            ignore: 1       // 非转换需要设置为，如10px 写成10*1px;
        }))
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 3 versions', '>8%'],
            cascade: false,        // 美化属性，默认true
        }))
        .pipe($.changed(`${distDev}/style`))
        .pipe(gulp.dest(`${distDev}/style`))
        .pipe(reload({stream: true}))
});

// stylelint检查
gulp.task('stylelint', () => 
    gulp.src('./src/style/**/*.@(less|css)')
        .pipe($.stylelint({
            failAfterError: true,
            reporters: [
                {formatter: 'string', console: true}
            ]
        }))
);

// 移动非es6数据
gulp.task('move-lib', () => 
    gulp.src(glob.lib)
        .pipe($.changed(`${distDev}/js`))
        .pipe(gulp.dest(`${distDev}/js`))
        .pipe(reload({stream: true}))
);

// 移动解析es6
gulp.task('move-script', ['eslint-script'], () => 
    gulp.src(glob.script)
        .pipe($.cache($.babel({ presets })))
        .pipe($.changed(`${distDev}/js`))
        .pipe(gulp.dest(`${distDev}/js`))
        .pipe(reload({stream: true}))
);

// eslint检查
gulp.task('eslint-script', () =>
    gulp.src(glob.script)
        .pipe($.eslint())
        .pipe($.eslint.formatEach())
        .pipe($.eslint.failAfterError())
);

// 移动并无损压缩图片
gulp.task('move-image', () =>
    gulp.src(glob.image)
        .pipe($.cache($.imagemin()))
        .pipe($.changed(`${distDev}/assets/img`))
        .pipe(gulp.dest(`${distDev}/assets/img`))
        .pipe(reload({stream: true}))
);

// 视频音频，发布最好改成外链，而不是直接使用本地资源
// 移动，如果在本地的话。注意.gitignore
gulp.task('move-media', () =>
    gulp.src(glob.media)
        .pipe($.changed(`${distDev}/assets`))
        .pipe(gulp.dest(`${distDev}/assets`))
        .pipe(reload({stream: true}))
);

// 清空文件夹
gulp.task('clean-dev', (cb) => del([distDev], cb));
gulp.task('clean-build', (cb) => del([distBuild], cb));


// -----------------------------------------------------------------
// build by gulp-requirejs-optimize
// -----------------------------------------------------------------

// AMD解析打包
gulp.task('package', () =>
    gulp.src(`${distDev}/js/app.js`)
        .pipe($.requirejsOptimize({
            mainConfigFile: './dist/dev/js/lib/requirejs/require.config.js'
        }))
        // .pipe($.hash())
        .pipe($.rename('app.min.js'))
        // .pipe(rename(function(path){
        //     path.basename += '.min';
        // }))
        .pipe(gulp.dest(`${distBuild}/js`))
);


// requirejs合并
gulp.task('requirejs', (cb) =>{
    pump([
        gulp.src([`${distDev}/js/lib/requirejs/require.js`, `${distDev}/js/lib/requirejs/require.config.js`])
            .pipe($.concat('require.combine.js')),
            // .pipe($.hash()),
        $.uglify(),
        gulp.dest(`${distBuild}/js`)
    ], cb);
});

// html替换压缩
gulp.task('htmlreplace', () =>
    gulp.src(`${distDev}/index.html`)
        .pipe($.htmlReplace({
            'js': ['js/require.combine.js', 'js/app.min.js'],
            'css': 'style/main.min.css'
        }))
        .pipe($.revHash({assetsDir: distBuild}))
        // .pipe($.htmlmin({
        //     removeComments: true,
        //     collapseWhitespace: false
        // }))
        .pipe(gulp.dest(`${distBuild}`))
);

// 移动资源
gulp.task('move-build-assets', () => {
    gulp.src([`${distDev}/assets/**/*`])
        .pipe(gulp.dest(`${distBuild}/assets`));
});

// 移动i18n
gulp.task('move-build-i18n', () => {
    gulp.src([`${distDev}/js/nls/**/*`])
        .pipe(gulp.dest(`${distBuild}/js/nls`));
});

// 移动样式
gulp.task('move-build-style', () => {
    gulp.src(`${distDev}/style/**/*`)
        .pipe($.cleanCss())
        .pipe($.rename('main.min.css'))
        .pipe(gulp.dest(`${distBuild}/style`));
});

// 组合操作
gulp.task('build', ['clean-build'], (cb) => {
    $.sequence(['package', 'requirejs', 'move-build-assets', 'move-build-i18n', 'move-build-style'], 'htmlreplace', 'server-build')(cb);
});