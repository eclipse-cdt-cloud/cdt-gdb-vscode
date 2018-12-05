const path = require('path');
const fs = require('fs');

adapterConfig = require(path.join(__dirname, 'src', 'cdt-gdb-adapter', 'webpack.config.js'));

adapterConfig.forEach((config) => {
    config.output.path = path.resolve(__dirname, 'out');
});

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