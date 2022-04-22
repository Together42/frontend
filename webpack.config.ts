const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectName = 'Together_42_project';
const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  name: 'bookcommentweb',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@main': path.resolve(__dirname, 'src/Main'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  entry: {
    app: './src/client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        use: ['css-loader'],
      },
      {
        test: /\.(svg|avif|webp)$/i,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: 'file-loader',
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
    new dotenv(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: isDevelopment ? '/' : `/${projectName}/`,
  },
  devServer: {
    historyApiFallback: true,
    port: 3050,
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = config;
