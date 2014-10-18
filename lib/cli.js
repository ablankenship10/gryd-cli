#!/usr/bin/env node
/**
 * Project Name: GrydCLI
 * Author: Aaron Blankenship
 * Date: 10-18-2014
 *
 * Copyright (c) 2014, Aaron Blankenship

 * Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee
 * is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
 * INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
 * FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
 * OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
 * OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 */

var argv = require('minimist')(process.argv.slice(2)),
  colors = require('colors'),
  self = require(__dirname + '/../package.json'),
  fs = require('fs'),
  cwd = process.cwd();

console.log("");
console.log("---- Gryd-CLI version " + self.version + " ----");

var isGryd = fs.existsSync(cwd + "/.gryd");
var anycommands = require('./any-commands');
var commands = (isGryd) ?
  require('./is-gryd') : require('./is-not-gryd');

for (var i in anycommands) {
  commands[i] = anycommands[i];
}

if (argv._.length && commands.hasOwnProperty(argv._[0])) {
  var func = argv._.shift(),
    params = argv._;
  delete argv._;
  if (commands[func].params.length != params.length)
    showHelp();
  else
    commands[func].function(params, argv, function (err) {
      if (err) {
        console.error(err.red);
        process.exit(1);
      } else {
        console.log("Operation completed successfully".green);
        process.exit();
      }
    });
} else {
  showHelp();
}

function showHelp() {
  if(isGryd)
    console.log("This is a Gryd Project!".green);
  console.log("Usage:".green);
  console.log("  gryd-cli" + " command".green + " params".yellow + " [--options]".red);
  console.log("");
  for (var c in commands) {
    var com = commands[c];
    if (com.available) {
      console.log((c + ": " + com.description).green);
      if (com.params.length) {
        console.log("  PARAMS:".yellow);
        for (var p in com.params) {
          var par = com.params[p];
          console.log(("    " + par.name + ": " + par.description).yellow);
        }
      }
      if (com.options.length) {
        console.log("  OPTIONS:".red);
        for (var o in com.options) {
          var opts = com.options[o];
          console.log(("    --" + opts.name + ": " + opts.description).red);
        }
      }
    }
  }
  console.log("");
  process.exit();
}