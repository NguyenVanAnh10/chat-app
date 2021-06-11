const { override, fixBabelImports, addWebpackAlias } = require('customize-cra');

module.exports = override(
  fixBabelImports('emoji-mart', {
    libraryDirectory: 'dist-modern/components/picker',
    style: false,
  }),
  addWebpackAlias({
    videojs: 'video.js/dist/alt/video.core.novtt.min.js',
    data_emoji_mart: 'emoji-mart/data/google.json',
  }),
);
