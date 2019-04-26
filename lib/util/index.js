["exit", "error"].forEach(m => {
  Object.assign(exports, require(`./${m}`));
});
