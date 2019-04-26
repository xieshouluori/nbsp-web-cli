const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const validateProjectName = require("validate-npm-package-name");
const { exit, error } = require("./util/index");
const {stopSpinner } = require("./util/spinner");
const Creator = require("./Creator");

async function create(projectName, options) {
  // nuxt create projectName -f
  // projectName: projectName
  // options : { force: true}


  // 1、生成项目名称和目录
  // cwd : /Users/niuniu/Documents/ceshi/npm-test-erli
  const cwd = options.cwd || process.cwd(); //当前目录
  const inCurrent = projectName === "."; //是否在当前目录
  const name = inCurrent ? path.relative("../", cwd) : projectName; //生成项目的名称
  const targetDir = path.resolve(cwd, projectName || "."); //生成项目的目录

  // 2、验证包名：判断项目名称是否符合 npm 包名规范，并输出相应的 errors 或者 warnings。
  const result = validateProjectName(name);
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name:${name}`));
    result.errors &&
      result.errors.forEach(err => {
        console.error(chalk.red.dim(`Error:${err}`));
      });
    result.warnings &&
      result.warnings.forEach(warn => {
        console.error(chalk.red.dim(`Waring:${warn}`));
      });
    exit(1);
  }
  //3、判断当前生成的项目目录是否与当前已有目录重复
  // 如果已有重复目录
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      //option 中设置了force,移除已有目录
      fs.remove(targetDir);
    } else {
      if (inCurrent) {
        // 如果在当前目录
      } else {
        // 使用交互命令，让用户选择处理方式
        const { action } = await inquirer.prompt([
          {
            name: "action",
            type: "list",
            message: `Target directory ${chalk.cyan(
              targetDir
            )} already exists. Pick an action:`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Merge", value: "Merge" },
              { name: "Cancel", value: false }
            ]
          }
        ]);
        if (!action) {
          return;
        } else if (action === "overwrite") {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
          await fs.remove(targetDir);
        }
      }
    }
  }

  // 4、get template 
  const creator = new Creator(name, targetDir);
  await creator.create(options);
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    error(err);
  });
};
