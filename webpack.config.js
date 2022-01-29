const path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        MemoryBrowser: './src/memory/client/index.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true,
                },
            },
        },
    },
    devtool: 'eval-source-map',
    resolve: {
        extensions: ['.js', '.ts', '.tsx', '.json'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        module: 'es2015',
                    },
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ],
    },
    performance: {
        hints: false,
    },
};
