var argv = require('minimist')(process.argv.slice(2)),
  exec = require("child_process").exec,
  colors = require('colors'),
  self = require(__dirname + '/../package.json'),
  ejs = require('ejs'),
  fs = require('fs'),
  pluralize = require('pluralize'),
  cwd = process.cwd();

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

console.log("");
console.log("");
console.log("---- Gryd-CLI version " + self.version + " ----");

if (argv._.length) {
  var func = null,
    name = null,
    opts = [];
  switch (argv._[0]) {
    case "init":
      func = newProject;
      name = argv._[1] || done("Usage: gryd-cli init name");
      break;
    case "resource":
      func = newResource;
      name = argv._[1] || done("Usage: gryd-cli resource app:name");
      break;
    case "help":
    default:
      func = showHelp;
      break;
  }
  delete argv._;
  for (var p in argv) {
    switch (p) {
      case 'validator':
        opts.push('gryd-validator');
        break;
      case 'docs':
        opts.push('gryd-docs');
        break;
      default:
        break;
    }
  }
  return func(name, opts);
} else {
  return showHelp();
}

function showHelp() {
  console.log("Usage:".green);
  console.log("  gryd-cli {init,resource,help} [app:name] [options]");
  console.log("");
  console.log("help              -  Display's this help menu.".green);
  console.log("resource app:name -  Auto-generates a new controller and model in the current project.".green);
  console.log("init name         -  Initializes a new project in the current directory.".green);
  console.log("  OPTIONS:".yellow);
  console.log("    --validator -  Includes the Gryd Validator module".yellow);
  console.log("    --docs      -  Includes the Gryd Docs module".yellow);
  done();
}

function newProject(name, opts) {
  //TODO - detect OS
  require('./scripts/init-bash')(name, opts, done);
}

function newResource(name, opts) {
  var contTemp = ejs.compile(
      fs.readFileSync(__dirname + '/templates/controller.ejs', 'utf8')
    ),
    modTemp = ejs.compile(
      fs.readFileSync(__dirname + '/templates/model.ejs', 'utf8')
    );

  if (!fs.existsSync(cwd + "/.gryd")) {
    done("This function must be ran from within the root directory of a Gryd Project");
  } else {
    var loc = name.split(':');
    if (loc.length != 2) {
      done("Usage: gryd-cli resource app:name");
    } else {
      var app = loc[0];
      var names = {
        singular: pluralize(loc[1], 1).toLowerCase(),
        plural: pluralize(loc[1]).toLowerCase(),
        cont: pluralize(loc[1], 1).toProperCase()+"Controller",
        model: pluralize(loc[1], 1).toProperCase()+"Model"
      };

      var contPath = cwd + "/app/"+app+"/controllers/"+names.cont+".js",
        modPath = cwd + "/app/"+app+"/models/"+names.model+".js";

      if(!fs.existsSync(cwd + "/app/"+app)){
        done("The application "+app+" does not exist in this project");
      } else if(fs.existsSync(contPath) || fs.existsSync(modPath)){
        done("Resource "+names.singular+" already exists in application "+app);
      } else {
        console.log("Generating Resource "+names.singular+" in application "+app);
        fs.writeFileSync(contPath,contTemp(names));
        fs.writeFileSync(modPath,modTemp(names));
        done();
      }
    }
  }
}

function done(err) {
  if (err) {
    console.error("Finished with errors".red);
    console.error(err);
    process.exit(1);
  } else {
    console.log("Finished successfully".green);
    process.exit();
  }
}