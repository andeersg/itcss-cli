const fs = require('fs');
const path = require('path');

let maxLevel = 10;

const findConfigFile = function(currentPath, level, max) {
  const parentPath = path.resolve(currentPath, '..');

  if (typeof max !== 'undefined') {
    maxLevel = max;
  }

  if (currentPath === parentPath) {
    return false;
  }

  const files = fs.readdirSync(currentPath);

  if (files.indexOf('.itcssrc') !== -1) {
    const rcFile = JSON.parse(fs.readFileSync(`${currentPath}/.itcssrc`));
    return {
      path: currentPath,
      config: rcFile,
    };
  }
  else {
    if (level === maxLevel) {
      return false;
    }

    return findConfigFile(parentPath, level + 1);
  }
};

module.exports = {
    findConfigFile: findConfigFile
}