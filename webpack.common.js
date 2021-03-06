const path = require('path');

module.exports = {
  entry: {
    asteroids:'./src/asteroids/index.ts',
    explorer:'./src/explorer/index.ts',
    trireme:'./src/trireme/index.ts',
  },
  watch:true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.mp3/,
        type: 'asset/inline',
       }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};

