/*
 * grunt-environmental
 * https://github.com/gleneivey/grunt-environmental
 *
 * Copyright (c) 2014 Glen E. Ivey
 * Licensed under the MIT license.
 */

"use strict";

var path = require("path"),
    fs = require('fs'),
    _ = require("lodash"),
    exec = require('child_process').exec;


module.exports = function (grunt) {
  grunt.registerTask(
      "environmental",
      "Load process.env from environmental-style shell scripts for subsequent grunt tasks.",
      function environmentalTaskFunction(target, injectionKey) {
        var options = this.options(),
            done = this.async(),
            scriptPath = options.envsPath || "./envs",
            environment = target || "development",
            scriptName = path.join(scriptPath, environment + ".sh"),
            getOriginalEnvironment = "/usr/bin/env bash -c 'printenv'",
            getUpdatedEnvironment = "/usr/bin/env bash -c 'source " +
                scriptName + " ; printenv'";

        if (!fs.existsSync(scriptName)) {
          grunt.fatal("Can't find a script to execute at '" + scriptName + "'.  Failing.", 10);
          return false;
        }

        exec(getOriginalEnvironment, function (status, originalEnvironment, stderr) {
          exec(getUpdatedEnvironment, function (status, updatedEnvironment, stderr) {
            var originalValues = originalEnvironment.split("\n"),
                updatedValues = updatedEnvironment.split("\n"),
                updates = _.difference(updatedValues, originalValues);

            _.each(updates, function (update) {
              var matchInfo = /^([^=]+)=(.+)$/.exec(update);
              process.env[matchInfo[1]] = matchInfo[2];
            });

            if (injectionKey) {
              var environmentalPrefix = process.env["NODE_APP_PREFIX"] + "_",
                  hashToInject = options.inject[injectionKey];
              _.each(_.keys(hashToInject), function (key) {
                process.env[environmentalPrefix + key] = hashToInject[key];
              });
            }

            done();
          });
        });
      });

  grunt.registerTask(
      "printenv",
      "Print the current content of the node interpreter's environment to stdout",
      function printenvTaskFunction() {
        var keys = Object.keys(process.env);
        for (var c=0;c < keys.length; c++){
          console.log(keys[c] + "=" + process.env[keys[c]]);
        }
      });
};
