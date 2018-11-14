const path = require('path');
const fs = require('fs');

let adapterDir = process.env['CDT_ADAPTER_DIR'] || '../cdt-gdb-adapter';
if (!fs.existsSync(adapterDir)) {
    adapterDir = path.join(__dirname, 'node_modules', 'cdt-gdb-adapter');
}
console.log('adapter directory: ' + adapterDir);
adapterConfig = require(path.join(adapterDir, 'webpack.config.js'));

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