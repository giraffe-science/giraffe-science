const path = require("path");
const { getLoader, loaderByName } = require("@craco/craco");
const absolutePath = path.join(__dirname, "../core");
module.exports = {
  webpack: {
    alias: {},
    plugins: [],
    configure: (webpackConfig, {  }) => {
      const { isFound, match } = getLoader(
        webpackConfig,
        loaderByName("babel-loader")
      );
      if (isFound) {
        // noinspection JSUnresolvedVariable
        const include = Array.isArray(match.loader.include)
          ? match.loader.include
          : [match.loader.include];
        // noinspection JSPrimitiveTypeWrapperUsage
        match.loader.include = include.concat[absolutePath];
      }
      return webpackConfig;
    }
  }
};
