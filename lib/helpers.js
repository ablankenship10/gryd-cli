var fs = require('fs');

exports.PROJECT_INSTALL_LOCATION = __dirname + "/gryd-project";

exports.PROJECT_REPO = "https://github.com/ablankenship10/gryd-project.git";

exports.isInstalled = fs.existsSync(exports.PROJECT_INSTALL_LOCATION);

exports.projectVersion = (exports.isInstalled) ?
  require(exports.PROJECT_INSTALL_LOCATION + "/package.json").version : "None";