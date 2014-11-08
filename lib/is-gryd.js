var helpers = require('./helpers'),
  fs = require('fs'),
  ejs = require('ejs'),
  pluralize = require('pluralize'),
  exec = require('child_process').exec,
  cwd = process.cwd();

module.exports = {
  app: {
    available: helpers.isInstalled,
    description: "Initialize a new application in the current project",
    params: [
      {
        name: "name",
        description: "The name of the new application"
      }
    ],
    options: [],
    function: app
  },
  resource: {
    available: helpers.isInstalled,
    description: "Generate a new Resource controller and model in the current project",
    params: [
      {
        name: "app",
        description: "The application name to install the new resource"
      },
      {
        name: "name",
        description: "The singular name of the new resource"
      }
    ],
    options: [],
    function: resource
  }
};


function app(params, opts, cb) {
  if (!fs.existsSync(cwd + "/" + params[0])) {
    console.log("Creation new application in current project...");
    exec("cp -R " + helpers.PROJECT_INSTALL_LOCATION + "/app/v1 " + params[0],
      {cwd: cwd + "/app"}, function (error, stdout, stderr) {
        if (error) {
          console.log(stderr);
          cb("Error occurred while copying files from local GrydScaffold path");
        } else {
          console.log(stdout);
          cb();
        }
      });
  } else {
    cb("Application " + params[0] + " already exists in this project");
  }
}

function resource(params, opts, cb) {
  var names = {
    singular: pluralize(params[1], 1).toLowerCase(),
    plural: pluralize(params[1]).toLowerCase(),
    controller: pluralize(params[1], 1).toProperCase()+"Controller",
    model: pluralize(params[1], 1).toProperCase()+"Model"
  };

  var contPath = cwd + "/app/"+params[0]+"/controllers/"+names.controller+".js",
    modPath = cwd + "/app/"+params[0]+"/models/"+names.model+".js";

  if(!fs.existsSync(cwd + "/app/"+params[0])){
    cb("The application "+params[0]+" does not exist in this project");
  } else if(fs.existsSync(contPath) || fs.existsSync(modPath)){
    cb("The resource "+params[1]+" already exists in this application");
  } else {
    console.log("Generating resource "+params[1]+" in application "+params[0]);
    var contTemplate = ejs.compile(
        fs.readFileSync(helpers.PROJECT_INSTALL_LOCATION + '/templates/controller.ejs', 'utf8')
      ),
      modTemplate = ejs.compile(
        fs.readFileSync(helpers.PROJECT_INSTALL_LOCATION + '/templates/model.ejs', 'utf8')
      );

    var error = (fs.writeFileSync(contPath,contTemplate(names)) ||
      fs.writeFileSync(modPath,modTemplate(names)))?
      "An error occurred during creation of new resource" : false;

    cb(error);
  }
}

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};