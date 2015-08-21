"use strict";

var exec    = require('child_process').exec;
var helpers = require('./helpers');

module.exports = {
  install: {
    available: !helpers.isInstalled,
    description: "Install a local copy of the base Gryd Project (Not Installed)",
    params: [],
    options: [
      {
        name: "v",
        description: "The version of GrydScaffold you wish to download"
      }
    ],
    function: update
  },
  update: {
    available: helpers.isInstalled,
    description: "Update the local copy of the base GrydScaffold (Current Version: " + helpers.projectVersion + ")",
    params: [],
    options: [
      {
        name: "v",
        description: "The version of GrydScaffold you wish to download"
      }
    ],
    function: update
  }
};

function update (params, opts, cb) {
  if (helpers.isInstalled) {
    console.log("Pulling latest GrydScaffold...");
    exec("git pull origin master",
      {cwd: helpers.PROJECT_INSTALL_LOCATION}, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          cb("Error occurred pulling latest version of GrydScaffold");
        } else {
          console.log(stdout);
          if (opts.v) {
            console.log("Checking out version " + opts.v);
            exec("git checkout tags/" + opts.v,
              {cwd: helpers.PROJECT_INSTALL_LOCATION}, function (error, stdout, stderr) {
                if (error) {
                  console.log(stderr);
                  cb("Error occurred attempting to checkout non-existent version");
                } else {
                  console.log(stdout);
                  cb();
                }
              });
          } else {
            cb();
          }
        }
      });
  } else {
    console.log("Cloning latest GrydScaffold...");
    exec("git clone " + helpers.PROJECT_REPO,
      {cwd: __dirname}, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          cb("Error occurred cloning latest version of GrydScaffold");
        } else {
          console.log(stdout);
          if (opts.v) {
            console.log("Checking out version " + opts.v);
            exec("git checkout tags/" + opts.v,
              {cwd: helpers.PROJECT_INSTALL_LOCATION}, function (error, stdout, stderr) {
                if (error) {
                  console.log(stderr);
                  cb("Error occurred attempting to checkout non-existent version");
                } else {
                  console.log(stdout);
                  cb();
                }
              });
          } else {
            cb();
          }
        }
      });
  }
}