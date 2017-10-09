#!/usr/bin/env node

// @TODO Store everything as JSON and build SCSS file instead of parsing and modifiying.
// @TODO Check for duplicate when adding.

const fs = require('fs');
const path = require('path');
const program = require('commander');
const promptly = require('promptly');
const chalk = require('chalk');

const mapTypes = require('./lib/mapTypes');
const configFile = require('./lib/configFile');
const parseSCSS = require('./lib/modifySCSS');

const maxLevel = 10;
const cwd = process.cwd();

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
    const config = configFile.findConfigFile(process.cwd(), 1);
    console.log(config);
    if (!config) {
      console.log(chalk.red('Could not locate config, did you init?'));
      return;
    }

    // Set current directory.
    process.chdir(config.path);

    let subfolder = mapTypes(options.type);

    const pathToAddFile = path.resolve(config.path, config.config.scssFolder, subfolder);
    if (!fs.existsSync(pathToAddFile)) {
      fs.mkdirSync(pathToAddFile);
      console.log(chalk.green(`Added folder: ${subfolder}`));
    }

    fs.writeFileSync(path.resolve(pathToAddFile, `_${name}.scss`), '');
    console.log(chalk.green(`Created file: _${name}.scss`));

    parseSCSS(config.config.scssFolder, name, subfolder);

    // Set current directory back to original.
    process.chdir(cwd);
  });
 
program.parse(process.argv);
