# grunt-environmental

> Load process.env from environmental-style shell scripts for subsequent grunt tasks.

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
package available to subsequent tasks run within the same Grunt
instance.

### General

`environmental` uses shell scripts to establish the desired
configuration, but invoking them just via `exec` has no effect on the
environment available in the node interpreter.  This task evaluates
the environment, executes environmental's script, re-checks the
shell environment afterward, and then makes whatever environment
changes the script has in node's `process.env`.

The `environmental` Grunt task doesn't take any configuration
options, but if it is invoked with a target, it uses that target
as the name of the `environmental` shell script to execute.  For
example, running the Grunt task `environmental:staging` loads
environment variables by executing the script `./envs/staging.sh`.
Specifying a target name that doesn't have a matching shell
script in the `envs` directory will produce an error.  If the
task is invoked without a target name, the default is
`development` (and an error will occur if the script
`./envs/development.sh` can't be found).

### Usage Examples

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
In lieu of a formal styleguide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test
our code using [Grunt](http://gruntjs.com/).
