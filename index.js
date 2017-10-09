#!/usr/bin/env node

// @TODO Store everything as JSON and build SCSS file instead of parsing and modifiying.
// @TODO Check for duplicate when adding.

const fs = require('fs');
const path = require('path');
const program = require('commander');
const promptly = require('promptly');
const chalk = require('chalk');

const maxLevel = 10;
const cwd = process.cwd();

const componentInfo = function(name) {
  switch (name) {
    case 'trump':
      return 'trumps';

    case 'tool':
      return 'tools';
  
    case 'base':
      return 'base';

    case 'generic':
      return 'generic';
    
    case 'object':
      return 'objects';
    
    case 'component':
      return 'components';
  }
  return 'components';
}

const findConfigFile = function(currentPath, level) {
  const parentPath = path.resolve(currentPath, '..');

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

program
  .version('0.1.0')
  .option('-C, --chdir <path>', 'change the working directory');
 
program
  .command('init')
  .description('Get started with a new ITCSS project')
  .action(function(env, options) {
    promptly.prompt(`Where is your SCSS folder? ${chalk.gray('Relative from this location')}`)
    .then(function (value) {
        const data = {
          scssFolder: value,
        };

        fs.writeFileSync('.itcssrc', JSON.stringify(data, null, 2));
        console.log(chalk.green('Config written, tool ready'));
    });
  });
 
program
  .command('add <name>')
  .description('Add the ITCSS part you want')
  .option('-t, --type <type>', 'Which component are you adding?', 'component')
  .action(function(name, options) {
    const config = findConfigFile(process.cwd(), 1);
    console.log(config);
    if (!config) {
      console.log(chalk.red('Could not locate config, did you init?'));
      return;
    }

    let subfolder = componentInfo(options.type);

    const pathToAddFile = path.resolve(config.path, config.config.scssFolder, subfolder);
    // @TODO Create folder if it does not exist.
    if (!fs.existsSync(pathToAddFile)) {
      // fs.mkdirSync(pathToAddFile);
      console.log(chalk.green(`Added folder: ${subfolder}`));
    }

    fs.writeFileSync(path.resolve(pathToAddFile, `_${name}.scss`), '');
    console.log(chalk.green(`Created file: _${name}.scss`));

    parseAndAppend(config.config.scssFolder, name, subfolder);
  });
 
program.parse(process.argv);
