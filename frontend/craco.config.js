const webpack = require('webpack');

module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        webpackConfig.resolve.fallback = {
          assert: require.resolve('assert/'),
          // tu peux ajouter d'autres polyfills si besoin ici
        };
        return webpackConfig;
      },
    },
  };
  