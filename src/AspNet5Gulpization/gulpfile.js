/// <binding />
var gulp = require("gulp"),
  autoprefixer = require("gulp-autoprefixer"),
  concat = require("gulp-concat"),
  del = require("del"),
  minifyCss = require("gulp-minify-css"),
  rename = require("gulp-rename"),
  runSequence = require("run-sequence"),
  sass = require("gulp-sass"),
  tsc = require("gulp-tsc"),
  uglify = require("gulp-uglify");

var paths = {
  frontend: {
    scss: {
      src: [
        "styles/*.scss"
      ],
      dest: "wwwroot/css"
    },
    ts: {
      src: [
        "scripts/*.ts"
      ],
      dest: "wwwroot/js"
    }
  },
  shared: {
    bower: {
      src: "bower_components",
      dest: "wwwroot/lib"
    }
  }
}

gulp.task(
  "rebuild",
  function (cb) {
    runSequence(
      "clean",
      "build",
      "minify",
      "delete-unminified",
      "rename-temp-minified",
      "delete-temp-minified",
      cb
    );
  }
);

// clean
gulp.task(
  "clean", function (cb) {
    runSequence(["frontend:clean-scss", "frontend:clean-ts"], cb);
  }
);

gulp.task(
  "frontend:clean-scss", function (cb) {
    del(paths.frontend.scss.dest + "/*", cb);
  }
);

gulp.task(
  "frontend:clean-ts", function (cb) {
    del(paths.frontend.ts.dest + "/*", cb);
  }
);

// build
gulp.task(
  "build", function (cb) {
    runSequence("frontend:build-scss", "frontend:build-ts", cb);
  }
);

gulp.task(
  "frontend:build-scss", function (cb) {
    return gulp.src(paths.frontend.scss.src)
      .pipe(sass())
      .pipe(gulp.dest(paths.frontend.scss.dest));
  }
);

gulp.task(
  "frontend:build-ts", function (cb) {
    return gulp.src(paths.frontend.ts.src)
      .pipe(tsc())
      .pipe(gulp.dest(paths.frontend.ts.dest));
  }
);

// minify
gulp.task(
  "minify", function (cb) {
    runSequence("frontend:minify-css", "frontend:minify-js", cb);
  }
);

gulp.task(
  "frontend:minify-css", function (cb) {
    return gulp.src(paths.frontend.scss.dest + "/*.css")
      .pipe(minifyCss())
      .pipe(autoprefixer("last 2 version", "safari 5", "ie 8", "ie 9"))
      .pipe(concat("aspnet5gulpization.min.css.temp"))
      .pipe(gulp.dest(paths.frontend.scss.dest));
  }
);

gulp.task(
  "frontend:minify-js", function (cb) {
    return gulp.src(paths.frontend.ts.dest + "/*.js")
      .pipe(uglify())
      .pipe(concat("aspnet5gulpization.min.js.temp"))
      .pipe(gulp.dest(paths.frontend.ts.dest));
  }
);

// delete-unminified
gulp.task(
  "delete-unminified", function (cb) {
    runSequence("frontend:delete-unminified-css", "frontend:delete-unminified-js", cb);
  }
);

gulp.task(
  "frontend:delete-unminified-css", function (cb) {
    del(paths.frontend.scss.dest + "/*.css", cb);
  }
);

gulp.task(
  "frontend:delete-unminified-js", function (cb) {
    del(paths.frontend.ts.dest + "/*.js", cb);
  }
);

// rename-temp-minified
gulp.task(
  "rename-temp-minified", function (cb) {
    runSequence("frontend:rename-temp-minified-css", "frontend:rename-temp-minified-js", cb);
  }
);

gulp.task(
  "frontend:rename-temp-minified-css", function (cb) {
    return gulp.src(paths.frontend.scss.dest + "/aspnet5gulpization.min.css.temp")
      .pipe(rename("aspnet5gulpization.min.css"))
      .pipe(gulp.dest(paths.frontend.scss.dest));
  }
);

gulp.task(
  "frontend:rename-temp-minified-js", function (cb) {
    return gulp.src(paths.frontend.ts.dest + "/aspnet5gulpization.min.js.temp")
      .pipe(rename("aspnet5gulpization.min.js"))
      .pipe(gulp.dest(paths.frontend.ts.dest));
  }
);

// delete-temp-minified
gulp.task(
  "delete-temp-minified", function (cb) {
    runSequence("frontend:delete-temp-minified-css", "frontend:delete-temp-minified-js", cb);
  }
);

gulp.task(
  "frontend:delete-temp-minified-css", function (cb) {
    del(paths.frontend.scss.dest + "/*.temp", cb);
  }
);

gulp.task(
  "frontend:delete-temp-minified-js", function (cb) {
    del(paths.frontend.ts.dest + "/*.temp", cb);
  }
);

// lib
gulp.task(
  "lib", function (cb) {
    runSequence("lib-clean", "lib-copy", cb);
  }
);

gulp.task(
  "lib-clean", function (cb) {
    del(paths.shared.bower.dest + "/*", cb);
  }
);

gulp.task(
  "lib-copy", function (cb) {
    var lib = {
      "/jquery": "/jquery/dist/jquery*.{js,map}",
      "/jquery-validation": "/jquery-validation/dist/jquery.validate*.js",
      "/jquery-validation-unobtrusive": "/jquery-validation-unobtrusive/jquery.validate.unobtrusive*.js"
    };

    for (var $package in lib) {
      gulp
        .src(paths.shared.bower.src + lib[$package])
        .pipe(gulp.dest(paths.shared.bower.dest + $package));
    }

    cb();
  }
);