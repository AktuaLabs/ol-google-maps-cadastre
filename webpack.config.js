var path = require('path');

module.exports = {
    entry: {
        wms: './src/wms.js',
        wfs: './src/wfs.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/build')
    },
    module: {
        loaders: [
            // **IMPORTANT** This is needed so that each bootstrap js file required by
            // bootstrap-webpack has access to the jQuery object
            {test: /bootstrap\/js\//, loader: 'imports-loader?jQuery=jquery'},

            {test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000'},

            {
                test: /\.js$/, exclude: /(node_modules|bower_components)/, use: {
                    loader: 'babel-loader',
                    options: {presets: ['env']}
                }
            }
        ],
    },
    devtool: 'inline-source-map',
    devServer: {
        publicPath: path.resolve(__dirname, 'public'),
        contentBase: path.resolve(__dirname, 'public'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload
    },
}