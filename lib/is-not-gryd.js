var helpers = require('./helpers'),
  fs = require('fs'),
  exec = require('child_process').exec,
  cwd = process.cwd();

module.exports = {
  init: {
    available: helpers.isInstalled,
    description: "Initialize a new GrydProject in this directory",
    params: [
      {
        name: "name",
        description: "The name for the new project"
      }
    ],
    options: [
      {
        name: "validator",
        description: "Includes the GrydValidator validation library"
      },
      {
        name: "docs",
        description: "Includes the GrydDocs documentation library"
      }
    ],
    function: init
  }
};

function init(params, opts, cb) {
  if (!fs.existsSync(cwd + "/" + params[0])) {
    console.log("Copying local GrydProject files into new project...");
    exec("cp -R " + helpers.PROJECT_INSTALL_LOCATION + " " + params[0],
      {cwd: cwd}, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          cb("Error occurred while copying files from local GrydProject path");
        } else {
          console.log(stdout);
          console.log("Removing unnecessary files...");
          exec("rm -rf .git templates app/v1", {cwd: cwd + "/" + params[0]},
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
                      var packages = [];
                      if (opts.validator)
                        packages.push('gryd-validator');
                      if (opts.docs)
                        packages.push('gryd-docs');
                      if (packages.length) {
                        console.log("Installing optional dependencies...");
                        exec("npm install --save " + packages.join(" "),
                          {cwd: cwd + "/" + params[0]}, function (error, stdout, stderr) {
                            if (error) {
                              console.log(stderr);
                              cb("Error occurred installing optional dependencies");
                            } else {
                              console.log(stdout);
                              cb();
                            }
                          });
                      }
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