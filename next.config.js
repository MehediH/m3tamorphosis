const withTM = require('next-transpile-modules')([
  'drei',
  'three',
  'react-spring',
]);

module.exports = withTM({
    webpack: (config) => {
        // config.module.rules.push({
        //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        //   loader: require.resolve("url-loader")
        // });

        config.node = {
          fs: 'empty'
        }
    
        return config;
    }
})