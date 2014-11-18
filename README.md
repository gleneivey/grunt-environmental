# grunt-environmental

Load process.env from environmental-style shell scripts for subsequent grunt tasks.

[![NPM version](http://badge.fury.io/js/grunt-environmental.png)](https://npmjs.org/package/grunt-environmental "View this project on NPM")
[![Build Status](https://api.travis-ci.org/gleneivey/grunt-environmental.png?branch=master)](https://travis-ci.org/gleneivey/grunt-environmental "Check this project's build status on TravisCI")
[![Dependency Status](https://david-dm.org/gleneivey/grunt-environmental.png?theme=shields.io)](https://david-dm.org/gleneivey/grunt-environmental)
[![Development Dependency Status](https://david-dm.org/gleneivey/grunt-environmental/dev-status.png?theme=shields.io)](https://david-dm.org/gleneivey/grunt-environmental#info=devDependencies)

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out
the [Getting Started](http://gruntjs.com/getting-started) guide, as it
explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as
well as install and use Grunt plugins. Once you're familiar with that process,
you may install this plugin with this command:

```shell
npm install grunt-environmental --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile
with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-environmental');
```

## The "environmental" Task

This task is intended to make environment variables configured using
the conventions of the
[environmental package](https://www.npmjs.org/package/environmental)
available to subsequent tasks run within the same Grunt
instance.

### General

The `environmental` package uses shell scripts to establish the desired
configuration, but invoking them just via `exec` has no effect on the
environment available in the node interpreter.  This task evaluates
the environment, executes environmental's script, re-checks the
shell environment afterward, and then the changes the script made to
the environment it ran within, are made to the environment in node's
`process.env`.


When the `environmental` Grunt task is invoked with a target,
it uses that target
as the name of the `environmental` shell script to execute.  For
example, running the Grunt task `environmental:staging` loads
environment variables by executing the script `./envs/staging.sh`.
Specifying a target name that doesn't have a matching shell
script in the `envs` directory will produce an error.  If the
task is invoked without a target name, the default is
`development` (and an error will occur if the script
`./envs/development.sh` can't be found).

### Configuration

There are two keys that the `environmental` task looks for within
its `options` hash in the overall Grunt configuration,

* `envsPath` By default, the `environmental` task looks for
scripts to execute within the directory `./envs`.  If this isn't
the correct directory in your system, use `envsPath` to specify a
string that gives the path of the directory where shell scripts
should be found.

* `inject` The `environmental` task can also insert items into node's
environment from a hash literal in the Grunt configuration.  The hash
of environment variables that should be injected is determined by the
third part of the Grunt task name that is used to invoke it--that is
the options argument name that follows the target name.  When a third
task name component is present, the `environmental` task will look
for an `inject` key in its options, and for the task argument as a
key within the `inject` hash.  It will then take the entire content
of the hash under that key and populate it into the current environment.

The keys in each injected hash are used to create the injected environment
variable names.  Complete names are created by appending the keys to the
value in the `NODE_APP_PREFIX` environment variable.  This will not
work correctly unless the shell script executed has, in fact, set
`NODE_APP_PREFIX` as is `environmental`'s convention.

For example, this configuration in `Gruntfile.js`

```
  grunt.initConfig({
    environmental: {
      options: {
        envsPath: "deploys"),
        inject: {
          "greek": {
            INJECTED_A: "alpha",
            INJECTED_B: "omega"
          }
        }
      }
    }
  });
```

Would set `deploys` as the name of the directory that will be used
as the location for environmental shell scripts.  And, if `NODE_APP_PREFIX`
is equal to `ALPHABET`, then invoking the task `environmental:test:greek`
will load the node environment by executing `deploys/test.sh` and then
setting the environment variables `ALPHABET_INJECTED_A` and
`ALPHABET_INJECTED_B`.

### Use in Task Registration

Here are two Grunt task definitions using `grunt-environmental`:

```js
grunt.registerTask("test", "run automated tests", ["environmental:test", "mochacli:unit"]);
grunt.registerTask("start", "start the server in the development environment",
  ["environmental", "server-start"]);
```

With this configuration, the `test` task will be run with the environment
variables set by the script `./envs/test.sh` and the `start` task will
be run with the environment established by `./envs/development.sh`.


## Bonus Task

This package also contains a Grunt task named "printenv", equivalent
to the \*nix `printenv(1)` command.  It's used by the unit tests to sample
Grunt's environment before and after the primary task executes.


## Contributing
In lieu of a formal style guide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test
our code using [Grunt](http://gruntjs.com/).
