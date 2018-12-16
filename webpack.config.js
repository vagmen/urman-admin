const webpack = require('webpack');
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const moment = require('moment');

const cssLoaders = (isProd) => {
  const loaders = [
    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        // If css modules needed
        localIdentName: '[name]__[local]___[hash:base64:5]',
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [autoprefixer()],
      },
    },
  ];

  return loaders;
};

function filterNull(items) {
  return items.filter((item) => item !== null);
}

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: {
      app: ['babel-polyfill', './src/app/index.js'],
    },
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js',
      chunkFilename: '[id].[contenthash].chunk.js',
    },
    resolve: {
      alias: {
        ui: path.resolve(__dirname, 'src', 'ui'),
        features: path.resolve(__dirname, 'src', 'features'),
        utils: path.resolve(__dirname, 'src', 'utils'),
        app: path.resolve(__dirname, 'src', 'app'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: cssLoaders(isProd),
        },
        {
          test: /\.less$/,
          use: [
            ...cssLoaders(isProd),
            {
              loader: 'less-loader',
              options: {
                // TODO: см. https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
                modifyVars: {
                  '@icon-url': "'/fonts/antd-icons/iconfont'",
                  '@border-radius-base': '0px',
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 15000,
              name: '[name].[ext]',
            },
          },
        },
      ],
    },
    plugins: filterNull([
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html',
        hash: isProd,
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
      !isProd ? new webpack.NamedModulesPlugin() : null,
      !isProd ? new webpack.HotModuleReplacementPlugin() : null,
      isProd
        ? new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: '../report.html',
          })
        : null,
      new CopyWebpackPlugin([{ from: 'src/fonts', to: 'fonts' }]),
      new webpack.DefinePlugin({
        BUILD_TYPE: JSON.stringify(argv['build-type'] || 'local'),
        BUILD_DATETIME: JSON.stringify(moment().format('DD.MM.YYYY HH:mm')),
      }),
      isProd ? new CleanWebpackPlugin(['dist']) : null,
    ]),
    devServer: {
      overlay: true,
      host: '0.0.0.0',
      disableHostCheck: true,
      hot: true,
      historyApiFallback: true,
      port: 3000,
      watchOptions: {
        // Delay the rebuild after the first change
        aggregateTimeout: 300,

        // Poll using interval (in ms, accepts boolean too)
        poll: 1000,
      },
    },
    optimization: {
      minimize: isProd,
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: true,
            mangle: true,
            keep_fnames: true,
            output: {
              beautify: false,
              comments: false,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
