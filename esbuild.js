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
};

const srcDir = path.join(__dirname, 'src');
/** @type {BuildOptions[]} */
const configurations = [
    {
        entryPoints: [path.join(srcDir, 'memory', 'client', 'index.tsx')],
        outfile: path.join(__dirname, 'dist', 'MemoryBrowser.js'),
        plugins: [sassPlugin()],
        format: 'iife',
        platform: 'browser',
        ...commonConfig,
    },
];

if (CLIWatch) {
    (async function watch() {
        await Promise.all(
            configurations.map((config) =>
                esbuild.context(config).then((context) => context.watch())
            )
        );
    })();
} else {
    (async function build() {
        await Promise.all(
            configurations.map((config) => esbuild.build(config))
        );
    })();
}
