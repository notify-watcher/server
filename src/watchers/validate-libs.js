/* eslint-disable no-console */
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
