# webpack-foo-plugin

## Usage

```js
const WebpackFooPlugin = require("@miyucy/webpack-foo-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          WebpackFooPlugin.loader,
          "babel-loader"
        ]
      },
      {
        test: /\.ts$/,
        use: [
          WebpackFooPlugin.loader,
          "ts-loader"
        ]
      }
    ]
  },
  plugins: [
    new WebpackFooPlugin()
  ]
};
```
