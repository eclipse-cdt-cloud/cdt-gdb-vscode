// @ts-check
const esbuild = require('esbuild');
const path = require('node:path');
const { sassPlugin } = require('esbuild-sass-plugin');

/** @typedef {import('esbuild').BuildOptions} BuildOptions */

const args = process.argv.slice(2);
const CLIWatch = args.includes('--watch');
const CLIDevelopment = CLIWatch || args.includes('--development');

/** @type {BuildOptions} */
const commonConfig = {
    bundle: true,
    target: ['es2020'],
    minify: !CLIDevelopment,
    sourcemap: CLIDevelopment,
}

const outDir = path.join(__dirname, 'out');
const debugAdapterRoot = path.join(__dirname, 'node_modules', 'cdt-gdb-adapter', 'dist');
/** @type {BuildOptions[]} */
const configurations = [
    {
        entryPoints: [path.join(outDir, 'extension.js')],
        outdir: path.join(__dirname, 'dist'),
        external: ['vscode'],
        format: 'cjs',
        platform: 'node',
        ...commonConfig
    },
    {
        entryPoints: [path.join(outDir, 'memory', 'client', 'index.js')],
        outfile: path.join(__dirname, 'dist', 'MemoryBrowser.js'),
        plugins: [sassPlugin()],
        format: 'iife',
        platform: 'browser',
        ...commonConfig
    },
    {
        entryPoints: [path.join(debugAdapterRoot, 'debugAdapter.js'), path.join(debugAdapterRoot, 'debugTargetAdapter.js')],
        outdir: path.join(__dirname, 'dist'),
        loader: { '.node': 'copy' },
        format: 'cjs',
        platform: 'node',
        ...commonConfig
    }
]

if (CLIWatch) {
    (async function watch() {
        await Promise.all(configurations.map(config => esbuild.context(config).then(context => context.watch())));
    })();
} else {
    (async function build() {
        await Promise.all(configurations.map(config => esbuild.build(config)));
    })();
}
