"use strict";

var helpers = require('./helpers');
var fs      = require('fs');
var exec    = require('child_process').exec;
var cwd     = process.cwd();

module.exports = {
  init: {
    available: helpers.isInstalled,
    description: "Initialize a new GrydScaffold in this directory",
    params: [
      {
        name: "name",
        description: "The name for the new project"
      }
    ],
    options: [],
    function: init
  }
};

function init (params, opts, cb) {
  if (!fs.existsSync(cwd + "/" + params[0])) {
    console.log("Copying local GrydScaffold files into new project...");
    exec("cp -R " + helpers.PROJECT_INSTALL_LOCATION + " " + params[0],
      {cwd: cwd}, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          cb("Error occurred while copying files from local GrydScaffold path");
        } else {
          console.log(stdout);
          console.log("Removing unnecessary files...");
          exec("rm -rf .git templates", {cwd: cwd + "/" + params[0]},
            function (error, stdout, stderr) {
              if (error) {
                console.log(stderr);
                cb("Error occurred removing unneeded files from new project");
              } else {
                console.log(stdout);
                console.log("Installing required dependencies...");
                exec("npm install", {cwd: cwd + "/" + params[0]},
                  function (error, stdout, stderr) {
                    if (error) {
                      console.log(stderr);
                      cb("Error occurred installing dependencies");
                    } else {
                      console.log(stdout);
                      cb();
                    }
                  });
              }
            });
        }
      });
  } else {
    cb("Project " + params[0] + " already exists");
  }
}