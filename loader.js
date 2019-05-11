const global = require("./global.js");

function loader(content, map, meta) {
  if (global.get()) {
    this.emitWarning(new Error("ファイルが変更されました"));
    return "";
  }
  return content;
}

function pitch(remainingRequest, precedingRequest, data) {
  if (global.get()) {
    return "";
  }
}
loader.pitch = pitch;

module.exports = loader;
