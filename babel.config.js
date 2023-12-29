module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'expo-image-picker',
      'expo-router/babel',
      'react-native-paper/babel',
    ],
  };
};
