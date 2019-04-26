exports.exit = code => {
  throw new Error(`Process exited with code ${code}`);
};
