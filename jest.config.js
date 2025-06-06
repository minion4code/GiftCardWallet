module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native' +
      '|@react-native' +
      '|react-redux' + // 👈 Add this
      '|@react-navigation' +
      '|@react-native-async-storage/async-storage' +
      '|react-native-swipe-list-view' +
      '|uuid' +
      ')/)',
  ],
};
