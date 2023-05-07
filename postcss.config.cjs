const postcssPresetEnv = require('postcss-preset-env');

module.exports = {
  plugins: [
    require('postcss-nested'),
    // require('autoprefixer'),
    postcssPresetEnv,
  ],
};