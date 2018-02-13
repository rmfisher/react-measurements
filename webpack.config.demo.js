const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: "./src/demo/index.js",
  output: {
    path: path.resolve(__dirname, "build/demo"),
    filename: "index.min.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: "./src/demo/index.html"
    }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|build)/,
        use: ["babel-loader"]
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "src"),
        exclude: /(node_modules|build)/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
