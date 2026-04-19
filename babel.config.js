module.exports = function (api) {
  api.cache(true);

  return {
    // Expo SDK 54 auto-configures Reanimated through babel-preset-expo.
    // Keeping the config minimal helps avoid iOS runtime mismatches.
    presets: ['babel-preset-expo'],
  };
};
