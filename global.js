const globalSpace = {
  abort: false
};

function get() {
  return globalSpace.abort;
}
function set(v) {
  return (globalSpace.abort = v);
}

module.exports = { get, set };
