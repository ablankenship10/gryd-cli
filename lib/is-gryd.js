"use strict";

var VALID_TYPES = ['String', 'Date', 'Number', 'Object', 'Array', 'Buffer', 'Boolean', 'Mixed', 'ObjectId'];

var helpers   = require('./helpers');
var fs        = require('fs');
var ejs       = require('ejs');
var pluralize = require('pluralize');
var cwd       = process.cwd();

module.exports = {
  controller: {
    available: helpers.isInstalled,
    description: "Generate a new REST controller with all HTTP methods, or optionally chosen methods",
    params: [
      {
        name: "name",
        description: "Name of the controller you wish to create"
      }
    ],
    options: [
      {
        name: "list",
        description: "Create a `list` function"
      },
      {
        name: "show",
        description: "Create a `show` function"
      },
      {
        name: "create",
        description: "Create a `create` function"
      },
      {
        name: "update",
        description: "Create a `update` function"
      },
      {
        name: "remove",
        description: "Create a `remove` function"
      }
    ],
    function: controller
  },
  model: {
    available: helpers.isInstalled,
    description: "Generate a new model with optionally provided fields",
    params: [
      {
        name: "name",
        description: "Name of the model you wish to create"
      }
    ],
    options: [
      {
        name: "fieldName fieldType",
        description: "Add fields to the new model e.g. --title String --date Date"
      }
    ],
    function: model
  }
};

function controller (params, opts, cb) {
  var defaultController = {list: true, show: true, create: true, update: true, remove: true};
  opts                  = (Object.keys(opts).length > 0) ? opts : defaultController;
  var name              = params[0].toLowerCase();
  var names             = {
    capSingle: capitalizeFirstLetter(pluralize(name, 1)),
    capPlural: capitalizeFirstLetter(pluralize(name, 2)),
    lowSingle: pluralize(name, 1),
    lowPlural: pluralize(name, 2)
  };
  fs.readFile(helpers.PROJECT_INSTALL_LOCATION + "/templates/controller.ejs", {encoding: "utf8"}, function (err, template) {
    if (err) {
      cb("Unable to load controller template file");
    } else {
      var ctrl_temp = ejs.compile(template);
      var output    = ctrl_temp({names: names, opts: opts});
      fs.writeFile(cwd + "/app/controllers/" + names.capPlural + ".js", output, function (err) {
        if (err) {
          cb("Error writing controller file to project");
        } else {
          cb();
        }
      });
    }
  });
}

function model (params, opts, cb) {
  var name   = params[0].toLowerCase();
  var names  = {
    capSingle: capitalizeFirstLetter(pluralize(name, 1)),
    capPlural: capitalizeFirstLetter(pluralize(name, 2)),
    lowSingle: pluralize(name, 1),
    lowPlural: pluralize(name, 2)
  };
  var fields = [];
  for (var i in opts) {
    if(VALID_TYPES.indexOf(opts[i]) != -1){
      if(opts[i] !== 'Object')
        fields.push({name:i, value:"{type: "+opts[i]+"}"});
      else
        fields.push({name:i, value:"{}"});
    } else {
      cb("Invalid type `"+opts[i]+"`");
    }
  }

  fs.readFile(helpers.PROJECT_INSTALL_LOCATION + "/templates/model.ejs", {encoding: "utf8"}, function (err, template) {
    if (err) {
      cb("Unable to load controller template file");
    } else {
      var mod_temp = ejs.compile(template);
      var output    = mod_temp({names: names, fields: fields});
      fs.writeFile(cwd + "/app/models/" + names.capSingle + ".js", output, function (err) {
        if (err) {
          cb("Error writing controller file to project");
        } else {
          cb();
        }
      });
    }
  });
}

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}