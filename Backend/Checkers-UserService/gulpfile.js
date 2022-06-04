const {
  src, dest, series,
} = require('gulp');
const del = require('del');
const fs = require('fs');
const log = require('fancy-log');
const webpackStream = require('webpack-stream');
const { exec } = require('child_process');
const webpackConfig = require('./webpack.config');

const paths = {
  prod_build: './build',
};

function clean() {
  log('removing the old files in the directory');
  return del('./build/**', { force: true });
}

function qualityAssurance(cb) {
  log('checking code quality');
  return exec('npm run lint', (err, stdout, stderr) => {
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function doTest(cb) {
  log('checking all tests');
  return exec('npm run test', (err, stdout, stderr) => {
    console.log(stderr);
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function testQualityAssurance(cb) {
  log('test coverage');
  return exec('npm run coverage', (err, stdout, stderr) => {
    console.log(stderr);
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function createProdBuildFolder() {
  const dir = paths.prod_build;
  log(`Creating the folder if not exist  ${dir}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
    log('📁  folder created:', dir);
  }

  return Promise.resolve('the value is ignored');
}

function copyNodeJSCodeTask() {
  log('building and copying server code into the directory');
  return webpackStream(webpackConfig)
    .pipe(dest(`${paths.prod_build}`));
}

function copyPackage() {
  log('zipping the code ');
  return src('./package.json')
    .pipe(dest(`${paths.prod_build}`));
}

exports.test = series(
  clean,
  qualityAssurance,
  doTest,
  testQualityAssurance,
);

exports.build = series(
  clean,
  createProdBuildFolder,
  copyNodeJSCodeTask,
  copyPackage,
);
