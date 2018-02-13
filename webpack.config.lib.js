const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: "./src/lib/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "lib/index.js",
    libraryTarget: "commonjs2"
  },
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
      }
    ]
  },
  externals: {
    react: "commonjs react",
    "draft-js": "draft-js"
  }
};
