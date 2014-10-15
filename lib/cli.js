var argv = require('minimist')(process.argv.slice(2)),
  exec = require("child_process").exec,
  colors = require('colors'),
  self = require(__dirname+'/../package.json'),
  cwd = process.cwd();

console.log("");
console.log("");
console.log("---- Gryd-CLI version "+self.version+" ----");

if(argv._.length){
  var func = null,
    name = null,
    opts = [];
  switch(argv._[0]){
    case "init":
      func = newProject;
      name = argv._[1] || "gryd-project";
      break;
    case "update":
      func = selfUpdate;
      break;
    case "help":
    default:
      func = showHelp;
      break;
  }
  delete argv._;
  for(var p in argv){
    switch(p){
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
  return func(opts,name);
} else {
  return showHelp();
}

function showHelp(){
  console.log("Usage:".green);
  console.log("  gryd-cli {init,help,update} [options]");
  console.log("");
  console.log("help   -  Display's this help menu.".green);
  console.log("update -  Update Gryd-CLI to the latest version from NPM.".green);
  console.log("init   -  Initializes a new project in the current directory.".green);
  console.log("  OPTIONS:".yellow);
  console.log("    --validator -  Includes the Gryd Validator module".yellow);
  console.log("    --docs      -  Includes the Gryd Docs module".yellow);
  done();
}

function selfUpdate(){
  exec("npm update -g "+self.name, function(error, stdout, stderr){
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      done(error);
    } else {
      done();
    }
  });
}

function newProject(opts,name){
  //TODO - detect OS
  require('./scripts/init-bash')(opts,name,done);
}

function done(err){
  if(err){
    console.log("Finished with errors".red,err);
    return 0;
  } else {
    console.log("Finished successfully".green);
    return 1;
  }
}