const path = require('path');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const projectName = 'frontend';
const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  name: 'togetherfront',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@main': path.resolve(__dirname, 'src/components/Main'),
      '@result': path.resolve(__dirname, 'src/components/Result'),
      '@auth': path.resolve(__dirname, 'src/components/Auth'),
      '@review': path.resolve(__dirname, 'src/components/Review'),
      '@timeline': path.resolve(__dirname, 'src/components/Timeline'),
      '@rotation': path.resolve(__dirname, 'src/components/Rotation'),
      '@utils': path.resolve(__dirname, 'src/components/utils'),
      '@recoil': path.resolve(__dirname, 'src/recoil'),
      '@img': path.resolve(__dirname, 'src/assets/img'),
      '@css': path.resolve(__dirname, 'src/assets/css'),
      '@usefulObj': path.resolve(__dirname, 'src/assets/usefulObj'),
      '@types': path.resolve(__dirname, 'src/assets/usefulObj/types'),
      '@cert': path.resolve(__dirname, 'src/cert'),
      '@globalObj': path.resolve(__dirname, 'src/globalObj'),
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
        test: /\.(scss|css)?$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(svg|avif|webp|png|jpeg)$/i,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf|jpg)$/i,
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
