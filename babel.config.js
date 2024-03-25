module.exports = function (api) {
  api.cache(true)
  const plugins = [
    [
      'module-resolver',
      {
        alias: {
          '@api': './mobile-app/api',
          '@assets': './assets',
          '@constants': './mobile-app/constants',
          '@contexts': './mobile-app/contexts',
          '@components': './mobile-app/components',
          '@environment': './environment',
          '@hooks': './mobile-app/hooks',
          '@types': './types',
          '@screens': './mobile-app/screens',
          '@store': './mobile-app/store',
          '@translations': './translations',
          '@tailwind': './mobile-app/tailwind'
        }
      }
    ],
    'react-native-reanimated/plugin'
  ]

  if (process.env.CYPRESS_E2E) {
    plugins.push('istanbul')
  }

  if (process.env.NODE_ENV === 'production') {
    plugins.push(['transform-remove-console', { 'exclude': ['error', 'warn'] }])
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: plugins
  }
}
