const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    videojs: 'video.js/dist/alt/video.core.novtt.min.js',
    data_emoji_mart: 'emoji-mart/data/google.json',
  }),
);
