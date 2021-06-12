const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
            filename: "index.html",
            template: "src/index.html",
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: [path.resolve(__dirname, 'src')],
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: './dev/assets'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};
