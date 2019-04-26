#!/usr/bin/env node

const semver = require("semver");
const chalk = require("chalk");
const program = require("commander");
const requiredVersion = require("../package.json").engines.node;
//1. 检查node的版本，
// 用户可能使用一个比较老的node版本
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        `You are using Node ${
          process.version
        },but this version of ${id} requires Node ${wanted} .\nPlease upgrade your Node version`
      )
    );
  }
}
checkNodeVersion(requiredVersion, "cli");
if (semver.satisfies(process.version, "9.x")) {
  console.log(
    chalk.red(
      `You are using Node ${
        process.version
      }.\nNode.js 9.x has already reached end-of-life and will not be supported in future major releases.\nIt's strongly recomended to use an active LTS version instead`
    )
  );
}
//2.定义shell命令
program
  .version(require("../package").version, "-v, --version")
  .usage("<command> [options]");

program
  .command("create <app-name>")
  .description("create a new project by nbsp-web-cli")
  .option("-f,--force", "Overwrite target directory if it exists")
  .action((name, cmd) => {
    // 获取所有option
    const options = cleanArgs(cmd);
    require("../lib/create")(name, options);
  });
program.parse(process.argv);

// convert -x to uppercase
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ""));
}

// 将实际选项提取到新object中
function cleanArgs(cmd) {
  const args = {};
  cmd.options.forEach(o => {
    //获取 option 的key值
    const key = camelize(o.long.replace(/^--/, ""));
    if (typeof cmd[key] != "function" && typeof cmd[key] !== "undefined") {
      args[key] = cmd[key];
    }
  });
  return args;
}
