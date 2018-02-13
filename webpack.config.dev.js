const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  devtool: "eval",
  entry: "./src/demo/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js"
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      inject: true,
      template: "./src/demo/index.html"
    })
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
  },
  devServer: {
    contentBase: "build",
    port: 3000
  }
};
