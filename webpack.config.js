const path = require('path');
module.exports = {
  entry: { main: './js/script.js' },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  }
}