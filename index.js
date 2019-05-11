const global = require("./global.js");
const Watchpack = require("watchpack");

const PluginName = "FooPlugin";
class FooPlugin {
  constructor() {
    this.activated = false;
    this.started = false;
    this.files = [];
    this.dirs = [];
  }

  apply(compiler) {
    compiler.hooks.watchRun.tap(PluginName, this.onWatchRun.bind(this));
    compiler.hooks.compilation.tap(PluginName, this.onCompilation.bind(this));
    compiler.hooks.invalid.tap(PluginName, this.onInvalid.bind(this));
    compiler.hooks.afterEmit.tapAsync(PluginName, this.onAfterEmit.bind(this));
    compiler.hooks.done.tapAsync(PluginName, this.onDone.bind(this));
    compiler.hooks.failed.tap(PluginName, this.onFailed.bind(this));
    compiler.hooks.shouldEmit.tap(PluginName, this.onShouldEmit.bind(this));
  }

  onWatchRun() {
    this.activated = true;
  }

  onCompilation(compilation) {
    compilation.hooks.shouldRecord.tap(PluginName, this.onShouldRecord.bind(this));
  }

  onShouldRecord() {
    if (global.get()) {
      return false;
    }
  }

  onShouldEmit(compilation) {
    if (global.get()) {
      return false;
    }
  }

  onInvalid(compiler) {
    this.started = true;
  }

  onAfterEmit(compilation, done) {
    this.files = Array.from(compilation.fileDependencies);
    this.dirs = Array.from(compilation.contextDependencies);
    done();
  }

  onDone(stats, done) {
    this.started = false;
    global.set(false);
    if (this.activated) {
      if (this.watchpack) {
        this.watchpack.close();
      }
      this.watchpack = this.newWatchpack();
      this.watchpack.watch([...this.files], [...this.dirs]);
      this.watchpack.on("aggregated", this.onAggregated.bind(this));
    }
    done();
  }

  onFailed(error) {
    this.started = false;
    global.set(false);
  }

  onAggregated() {
    if (this.started) {
      global.set(true);
    }
  }

  newWatchpack() {
    return new Watchpack({
      aggregateTimeout: 100,
      ignored: /node_modules/
    });
  }
}

FooPlugin.loader = require.resolve("./loader.js");

module.exports = FooPlugin;
