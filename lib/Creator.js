const path = require("path");
const chalk = require("chalk");
const EventEmitter = require("events");
const clone = require("gh-clone");
const { clearConsole, log } = require("./util/logger");
const { logWithSpinner, stopSpinner } = require("./util/spinner.js");
const { exit, error } = require("./util/index");
const { installDeps } = require("./installDeps");

module.exports = class Creator extends EventEmitter {
  constructor(name, context) {
    super();
    this.name = name;
    this.context = context;
  }

  async create(cliOptions = {}) {
    const { name, context, installDep, run } = this;
    await clearConsole();
    logWithSpinner(`✨`, `Creating project in ${chalk.yellow(context)}.`);
    this.emit("creation", { event: "creating" });

    //git clone Template
    stopSpinner();
    log();
    log(`⛹️  clone template. This might take a while...`);
    // http://gitlab.puhuitech.cn/nbfe/nbsp/nuxt-ts-el-template.git
    // https://github.com/xieshouluori/nuxt-ts-el-tempalte.git
    await clone(
      ["http://gitlab.puhuitech.cn/nbfe/nbsp/nuxt-ts-el-template.git"],
      {
        dest: context
      }
    );

    // install plugins
    stopSpinner();
    let packages = require(path.resolve(context, "package.json"));
    log();
    log(`🚀  Installing plugins. This might take a while...`);
    this.emit("creation", { event: "plugins-install" });
    await installDeps(context, cliOptions.registry, packages);

    // log instructions
    stopSpinner();
    log();
    log(`🎉  Successfully created project ${chalk.yellow(name)}.`);

    log();
    log(
      `👉  Get started with the following commands:\n\n` +
        (this.context === process.cwd()
          ? ``
          : chalk.cyan(` ${chalk.gray("$")} cd ${name}\n`)) +
        chalk.cyan(` ${chalk.gray("$")} ${"yarn dev"}`)
    );
    log();
    this.emit("creation", { event: "done" });
  }
};
