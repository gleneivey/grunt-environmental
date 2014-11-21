'use strict';

var grunt = require('grunt'),
    path = require("path");


function assertTaskWasSuccessful(test, error, output, code) {
  test.equal(error, null, "Shouldn't have had any errors during test Grunt run");
  test.equal(code, 0, "Shouldn't have had any errors during test Grunt run");
  test.notEqual(output.stdout.indexOf('Running "environmental'), -1,
      "Test Grunt run didn't give task-starting message");
  test.notEqual(output.stdout.indexOf("Done, without errors"), -1,
      "Test Grunt run didn't give Done message");

  var taskResults = output.stdout.split(/Running ".*? task/);
  test.equal(taskResults.length, 4,
      "STDOUT from running the test Grunt task should include info on three subtasks.  Is actually:\n\n" + output.stdout);
  return taskResults;
}

exports.environmental = {
  setUp: function (done) {
    grunt.loadTasks(path.join(__dirname, "..", "tasks"));
    done();
  },

  testLoadsDevelopmentEnvironmentByDefault: function (test) {
    test.expect(9);

    grunt.util.spawn({
      grunt: true,
      args: [
        '--gruntfile', path.join(__dirname, "fixture", "gruntfiles", "development.js"),
        "test-environmental"
      ]
    }, function (error, output, code) {
      var taskResults = assertTaskWasSuccessful(test, error, output, code);

      if (taskResults.length === 4) {
        test.equal(taskResults[1].indexOf("NODE_APP_PREFIX"), -1,
            "NODE_APP_PREFIX shouldn't be in the environment before code runs");
        // data from test/fixture/test_envs/development.sh
        test.notEqual(taskResults[3].indexOf("NODE_APP_PREFIX=ENV_TEST_DEV"), -1,
            "NODE_APP_PREFIX should be ENV_TEST_DEV");
        test.notEqual(taskResults[3].indexOf("ENV_TEST_DEV_INFO=development"), -1,
            "ENV_TEST_DEV_INFO should be 'development'");
        test.notEqual(taskResults[3].indexOf("this=that"), -1,
            "Environment should contain complete, exact string for value containing an equal sign");
      }

      test.done();
    });
  },

  testLoadsTargetEnvironment: function (test) {
    test.expect(8);

    grunt.util.spawn({
      grunt: true,
      args: [
        '--gruntfile', path.join(__dirname, "fixture", "gruntfiles", "production.js"),
        "test-environmental"
      ]
    }, function (error, output, code) {
      var taskResults = assertTaskWasSuccessful(test, error, output, code);

      if (taskResults.length === 4) {
        test.equal(taskResults[1].indexOf("NODE_APP_PREFIX"), -1,
            "NODE_APP_PREFIX shouldn't be in the environment before code runs");
        // data from test/fixture/test_envs/production.sh
        test.notEqual(taskResults[3].indexOf("NODE_APP_PREFIX=ENV_TEST_PROD"), -1,
            "NODE_APP_PREFIX should be ENV_TEST_PROD");
        test.notEqual(taskResults[3].indexOf("ENV_TEST_PROD_INFO=production"), -1,
            "ENV_TEST_PROD_INFO should be 'production'");
      }

      test.done();
    });
  },

  testFailsIfNoScriptForTarget: function (test) {
    test.expect(4);

    grunt.util.spawn({
      grunt: true,
      args: [
        '--gruntfile', path.join(__dirname, "fixture", "gruntfiles", "badTarget.js"),
        "test-environmental"
      ]
    }, function (error, output, code) {
      var firstIndexOf = output.stdout.indexOf("Can't find a script to execute at '");
      test.notEqual(firstIndexOf, -1, "Should have had a failure message");
      test.notEqual(output.stdout.indexOf("badTarget.sh'.  Failing", firstIndexOf),
          -1, "Error message should have ended with per-environment script name"
      );
      test.equal(output.stdout.indexOf('Running "printenv" task'), -1,
          "Should not have run the task following the errored task"
      );
      test.notEqual(code, 0, "Should return a non-zero status code to the shell");

      test.done();
    });
  },

  testIncludesItemsFromInjectOptionsIntoEnvironment: function (test) {
    test.expect(8);

    grunt.util.spawn({
      grunt: true,
      args: [
        '--gruntfile', path.join(__dirname, "fixture", "gruntfiles", "inject.js"),
        "test-environmental"
      ]
    }, function(error, output, code) {
      var taskResults = assertTaskWasSuccessful(test, error, output, code);

      if (taskResults.length === 4) {
        // data from test/fixture/test_envs/development.sh
        test.notEqual(taskResults[3].indexOf("NODE_APP_PREFIX=ENV_TEST_DEV"), -1,
            "NODE_APP_PREFIX should be ENV_TEST_DEV");
        test.notEqual(taskResults[3].indexOf("ENV_TEST_DEV_INJECTED_A=alpha"), -1,
            "ENV_TEST_DEV_INJECTED_A should be 'alpha'");
        test.notEqual(taskResults[3].indexOf("ENV_TEST_DEV_INJECTED_B=omega"), -1,
            "ENV_TEST_DEV_INJECTED_B should be 'omega'");
      }

      test.done();
    });
  }
};
