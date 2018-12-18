const path = require('path');

module.exports = [
    ...adapterConfig,
    {
        target: 'node',
        mode: 'none',
        context: __dirname,
        resolve: {
            extensions: [ '.ts', '.js' ]
        },
        entry: {
            extension: './src/extension.ts'
        },
        output: {
            path: path.resolve(__dirname, 'out'),
            filename: '[name].js',
            libraryTarget: 'commonjs',
            devtoolModuleFilenameTemplate: '[absolute-resource-path]'
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                }
            ]
        },
        externals: [
            'vscode'
        ]
    }
];