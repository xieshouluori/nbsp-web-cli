const chalk = require("chalk");
const path = require("path");
const execa = require("execa");
const { logWithSpinner, stopSpinner } = require("./util/spinner.js");

function executeCommand(command, targetDir, packages) {
  return new Promise(async (resolve, reject) => {
    const child = execa(command, [], {
      cwd: targetDir,
      stdio: ["inherit", "inherit", "inherit"]
    });
    child.on("close", code => {
      if (code !== 0) {
        reject(`command failed: ${command}`);
        return;
      }
      resolve();
    });
  });
}

exports.installDeps = async function installDeps(
  targetDir,
  cliRegistry,
  packages
) {
  await executeCommand("yarn", targetDir, packages);
};
