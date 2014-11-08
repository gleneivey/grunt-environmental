var path = require("path");

module.exports = function (grunt) {
  grunt.initConfig({
    environmental: {
      options: {
        envsPath: path.join(__dirname, "..", "test_envs")
      }
    }
  });
  grunt.loadTasks(path.join(__dirname, "..", "..", "..", "tasks"));
  grunt.registerTask("test-environmental", ["printenv", "environmental:production", "printenv"]);
};
