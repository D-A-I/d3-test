module.exports = {
    entry: {
      app: './src/app'
    },
    output: {
      /** 
       * webpackのpathは、絶対パスにしないとエラーになる
       * Node.jsの変数'__dirname'より、実行ソースのディレクトリを取得する
       */
      path: `${__dirname}/dist`,
      filename: '[name].bundle.js',
      devtoolModuleFilenameTemplate: `${__dirname}/dist/[resource-path]`,
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    module: {
      rules: [
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
    },
    devtool: '#source-map',
  };