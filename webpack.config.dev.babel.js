import {join} from 'path';
import {HotModuleReplacementPlugin} from 'webpack';

const publicPath = 'http://localhost:8080/';

export default {
  devtool: 'source-map',
  entry: [
    `webpack-dev-server/client?${publicPath}`,
    'webpack/hot/only-dev-server',
    join(__dirname, 'example/index.js')
  ],
  output: {
    path: join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath
  },
  devServer: {
    contentBase: join(__dirname, 'example')
  },
  plugins: [
    new HotModuleReplacementPlugin()
  ],
  resolve: {
    alias: {
      'react-algoliasearch-helper': join(__dirname, 'index.js')
    }
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/
    }]
  }
};
