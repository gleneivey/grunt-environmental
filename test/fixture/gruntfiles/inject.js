var path = require("path");

module.exports = function (grunt) {
  grunt.initConfig({
    environmental: {
      options: {
        envsPath: path.join(__dirname, "..", "test_envs"),
        inject: {
          "add-stuff": {
            INJECTED_A: "alpha",
            INJECTED_B: "omega"
          }
        }
      }
    }
  });

  grunt.loadTasks(path.join(__dirname, "..", "..", "..", "tasks"));
  grunt.registerTask("test-environmental", ["printenv", "environmental:development:add-stuff", "printenv"]);
};
