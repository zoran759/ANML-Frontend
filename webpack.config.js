const path = require('path');

module.exports = {
  entry: './src/libs/main/script.js',
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/env",
            {
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          ],
        }

      },
      {
        test: /\.scss$/,
        loaders: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ]
  }
  ,
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.resolve(__dirname, './dist/assets'),
    publicPath: "./assets/",
    filename: 'bundle.js'
  }
};