import {join} from 'path';
import {DefinePlugin} from 'webpack';

export default {
  entry: {
    reactAlgoliaSearchHelper: './index.js'
  },
  devtool: 'source-map',
  output: {
    path: './dist/umd',
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/, exclude: /node_modules/, loader: 'babel'
    }]
  },
  // when module not found, find locally first
  // helps fixing the npm link not working with webpack
  // http://stackoverflow.com/a/33722844/147079
  resolve: {
    fallback: [join(__dirname, 'node_modules')]
  },
  resolveLoader: {
    fallback: [join(__dirname, 'node_modules')]
  },
  // replace usage of process.env.NODE_ENV with the actual NODE_ENV from command line
  // when building. Some modules might be using it, this way we will reduce the code output when
  // NODE_ENV === 'production' and NODE_ENV=production was used to build
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
};
