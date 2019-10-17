/* eslint-disable no-console */

// TODO: For now we're asuming that all libs are being passed to the watcher
// We should change @notify-watcher/core to allow the creation of custom execute
// functions that pass more libs, and then do the validation against those.
// This also means that @notify-watcher/core should have a way to obtain the list
// of libs that are being passed to watchers

const fs = require('fs-extra');

const serverLibs = fs.readdirSync('./node_modules');

function validateLibs({ config: { libs }, name }) {
  const missingLibs = [];
  for (let i = 0; i < libs.length; i += 1) {
    const lib = libs[i];
    if (!serverLibs.includes(lib)) missingLibs.push(lib);
  }
  if (missingLibs.length > 0) {
    console.warn(`WARN: Missing libs ${libs} for watcher ${name}`);
    return false;
  }
  return true;
}

module.exports = validateLibs;
