#!/usr/bin/env node

import inquirer from 'inquirer';
import * as fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as template from './utils/template.js';
import shell from 'shelljs';
import figlet from 'figlet';

const CURR_DIR = process.cwd();
const __dirname = dirname(fileURLToPath(import.meta.url));

const CHOICES = fs.readdirSync(`${__dirname}/templates`);

const QUESTIONS = [
  {
    name: 'project-choice',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES,
    when: () => !yargs(hideBin(process.argv)).argv['template'],
  },
  {
    name: 'project-folder-name',
    type: 'input',
    message: 'Folder Name',
    default: 'ExampleExtension',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
    when: () => !yargs(hideBin(process.argv)).argv['project-folder-name'],
  },
  {
    name: 'author',
    type: 'input',
    message: 'Author',
    default: 'Author',
    validate: function (input) {
      if (/^([A-Za-z\-\\_\d])+$/.test(input)) return true;
      else return 'Project name may only include letters, numbers, underscores and hashes.';
    },
    when: () => !yargs(hideBin(process.argv)).argv['author'],
  },
  {
    name: 'description',
    type: 'input',
    default: 'Description of project.',
    message: 'Description of project:',
    when: () => !yargs(hideBin(process.argv)).argv['description'],
  },
  {
    name: 'vendor-name',
    type: 'input',
    message: 'Vendor name:',
    default: '@example/example-extensions',
    when: () => !yargs(hideBin(process.argv)).argv['vendor-name'],
  },
];

console.log(figlet.textSync('Blank Venia Extension'));

inquirer.prompt(QUESTIONS).then(answers => {
  answers = Object.assign({}, answers, yargs.argv);
  const projectChoice = answers['project-choice'];
  const projectFolderName = answers['project-folder-name'];
  const projectVendorName = answers['vendor-name'];
  const author = answers['author'];
  const description = answers['description'];
  const templatePath = `${__dirname}/templates/${projectChoice}`;
  const targetPath = path.join(CURR_DIR, projectFolderName);
  const options = {
    projectFolderName,
    projectVendorName,
    templateName: projectChoice,
    templatePath,
    author,
    description,
    targetPath,
  };
  if (!createProject(options.targetPath)) {
    return;
  }

  createDirectoryContents(templatePath, options);
  postProcess(options);
});

function createProject(projectPath) {
  if (fs.existsSync(projectPath)) {
    console.error(`Folder ${projectPath} exists. Delete or use another name.`);
    return false;
  }
  fs.mkdirSync(projectPath);
  return true;
}

// list of file/folder that should not be copied
const SKIP_FILES = ['node_modules', '.template.json'];

function createDirectoryContents(templatePath, options) {
  const { projectFolderName, projectVendorName, author, description } = options;
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);

  // loop each file/folder
  filesToCreate.forEach(file => {
    const origFilePath = path.join(templatePath, file);
    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, 'utf8');
      contents = template.render(contents, { projectVendorName, author, description });

      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectFolderName, file);

      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(CURR_DIR, projectFolderName, file));
      // copy files/folder inside current folder recursively
      const newOptions = {
        ...options,
        projectFolderName: path.join(projectFolderName, file),
      };
      createDirectoryContents(path.join(templatePath, file), newOptions);
    }
  });
}

function postProcess(options) {
  const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
  if (isNode) {
    shell.cd(options.targetPath);
    const result = shell.exec('yarn install');
    if (result.code !== 0) {
      return false;
    }
  }

  return true;
}
