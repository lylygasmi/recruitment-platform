const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve("process/browser.js"),
        buffer: require.resolve("buffer/"),
        util: require.resolve("util/"),
        assert: require.resolve("assert/"),
        stream: require.resolve("stream-browserify"),
        path: require.resolve("path-browserify"),
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser.js",
          Buffer: ["buffer", "Buffer"],
        })
      );

      return config;
    },
  },
};
