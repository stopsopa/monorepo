
const { spawn } = require("child_process");

const serializeError   = require('./serializeError');

const th    = msg => new Error(`${__filename} error: ${msg}`);

/**
 * Running:
 *
 const data = await cmd([
 'ls',
 '-la',
 '/Users/sd/Workspace/projects/monorepo/monorepo-master/a b c/test'
 ]);
 will work for directory with spacec in name
 */

module.exports = (cmd, opt) => new Promise((resolve, reject) => {

  if (typeof cmd === 'string') {

    cmd = cmd.trim();

    if ( ! cmd ) {

      throw th(`cmd is an empty string`);
    }

    cmd = commandb.split(/\s+/);
  }

  if ( ! Array.isArray(cmd) ) {

    throw th(`cmd is not an array`);
  }

  if ( ! cmd.length) {

    throw th(`cmd is an empty array`);
  }

  const {
    verbose = false,
  } = {...opt};

  verbose && console.log(`executing command ${c.g(cmd.join(' '))}`)

  const [command, ...args] = cmd;

  const process = spawn(command, args);

  let stdout = '';

  let stderr = '';

  process.stdout.on("data", data => {
    stdout += String(data);
  });

  process.stderr.on("data", data => {
    stderr += String(data);
  });

  process.on('error', (e) => {

    verbose && console.log(`error: ${e.message}`);

    reject({
      cmd,
      stdout,
      stderr,
      e: serializeError(e)
    });
  });

  process.on("close", code => {

    verbose && console.log(`child process ${c.g(cmd.join(' '))} exited with code ${code}`);

    if (code !== 0) {

      return reject({
        cmd,
        stdout,
        stderr,
        code,
      });
    }

    resolve({
      cmd,
      stdout,
      stderr,
      code,
    });
  });
})