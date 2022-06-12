const { src, dest, series } = require("gulp");
const del = require("del");
const fs = require("fs");
const zip = require("gulp-zip");
const log = require("fancy-log");
const exec = require("child_process").exec;

const paths = {
  prod_build: "./build",
  vue_src: "./dist/**/*",
  vue_dist: "./build/dist",
  zipped_file_name: "frontend-nodejs.zip",
};

function cleanPreviousBuild() {
  log("removing the old files in the directory");
  return del(`${paths.prod_build}`, { force: true });
}

function qualityAssurance(cb) {
  log("assurance Vue's code quality");
  return exec("npm run lint", function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function buildVueCodeTask(cb) {
  log("building Vue code into the directory");
  return exec("npm run build", function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function doTest(cb) {
  log("testing Vue code");
  return exec("npm run test", function (err, stdout, stderr) {
    log(stdout);
    log(stderr);
    cb(err);
  });
}

function testQualityAssurance(cb) {
  log("testing with coverage");
  return exec("npm run coverage", function (err, stdout, stderr) {
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
    log("📁  folder created:", dir);
  }

  return Promise.resolve("the value is ignored");
}

function copyVueCodeTask() {
  log("copying Vue code into the directory");
  return src(`${paths.vue_src}`).pipe(dest(`${paths.vue_dist}`));
}

function zippingTask() {
  log("zipping the code ");
  return src(`${paths.prod_build}/**`)
    .pipe(zip(`${paths.zipped_file_name}`))
    .pipe(dest(`${paths.prod_build}`));
}

function deleteDistBuildFolder() {
  log("deleting dist build folder");
  return del("./dist", { force: true });
}

exports.test = series(qualityAssurance, doTest, testQualityAssurance);

exports.build = series(
  cleanPreviousBuild,
  createProdBuildFolder,
  qualityAssurance,
  buildVueCodeTask,
  copyVueCodeTask,
  zippingTask,
  deleteDistBuildFolder
);
