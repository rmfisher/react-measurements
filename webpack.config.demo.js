const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const config = {
  devtool: 'source-map',
  entry: './src/demo/index.js',
  output: {
    path: path.resolve(__dirname, 'build/demo'),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './src/demo/index.html',
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-0'],
          }
        }
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif)$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /(node_modules|build)/,
        use: ['file-loader'],
      },
    ]
  }
}

module.exports = config