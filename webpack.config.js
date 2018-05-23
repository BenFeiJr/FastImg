const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        index: './src/app.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
        port: '2323'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
}