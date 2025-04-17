module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true }, // Required for MobX decorators
    ],
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true }, // Optional but recommended
    ],
    [
      'module-resolver',
      {
        alias: {
          '@': './src',
          '@components': './src/components',
          '@shared': './src/components/shared',
        },
      },
    ],
  ],
};
