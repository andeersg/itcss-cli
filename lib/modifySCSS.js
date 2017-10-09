const path = require('path');
const fs = require('fs');

const parseAndAppend = function(rootSCSS, newFile, folder) {
  const mainStyle = path.resolve(rootSCSS, 'style.scss');
  const styleSCSS = fs.readFileSync(mainStyle, 'utf8');
  const styleLines = styleSCSS.split("\n");

  let correctSection = false;

  for (var i = 0; i < styleLines.length; i++) {
    if (styleLines[i].startsWith('// ')) {
      const filePart = styleLines[i].replace('// ', '').toLowerCase();
      if (filePart === folder) {
        correctSection = true;
      }
    }
    if (correctSection && styleLines[i] === '') {
      // We found first empty line. Add ours.
      const newLine = `@import '${folder}/${newFile}';`;
      styleLines.splice(i, 0, newLine);
      break;
    }
  }

  fs.writeFileSync(mainStyle, styleLines.join("\n"));
};

module.exports = parseAndAppend;
