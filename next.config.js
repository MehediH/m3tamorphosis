const withTM = require('next-transpile-modules')([
    'drei',
    'three',
    'react-spring',
])
  
module.exports = withTM()