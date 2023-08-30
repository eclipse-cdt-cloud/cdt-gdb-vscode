// @ts-check
const esbuild = require('esbuild');
const path = require('node:path');
const { sassPlugin } = require('esbuild-sass-plugin');

/** @typedef {import('esbuild').BuildResult} BuildResult */
/** @typedef {import('esbuild').BuildContext} BuildContext */
/** @typedef {import('esbuild').BuildOptions} BuildOptions */
/** @typedef {Required<Pick<BuildOptions, 'entryPoints'|'outdir'>> & Partial<BuildOptions>} ESBuildConfig */
/**
 * @template {boolean} T
 * @typedef {T extends true ? BuildContext : BuildResult} Build 
 */
/**
 * @typedef {<T extends boolean>(doWatch: T) => Promise<Build<T>>} BuildExecutor
 */

const args = process.argv.slice(2);
const CLIWatch = args.includes('--watch');
const CLIDevelopment = CLIWatch || args.includes('--development');
const CLIDefaultConfig = {
    minify: !CLIDevelopment,
    sourcemap: CLIDevelopment
};

/**
 * @template {boolean} T
 * @param {T} doWatch
 * @param {BuildOptions} config
 * @returns {Promise<Build<T>>}
 */
function buildOrWatch(doWatch, config) {
    // @ts-expect-error // Doesn't understand that we are returning the correct thing.
    if (doWatch) { return esbuild.context(config) }
    // @ts-expect-error // Doesn't understand that we are returning the correct thing.
    return esbuild.build(config);
}

/**
 * @param {{doWatch?: boolean, buildComponents: Array<BuildExecutor>}} config 
 */
async function buildAndWatch(config) {
    const doWatch = config.doWatch ?? CLIWatch;
    await Promise.all(config.buildComponents.map(component => component(doWatch)))
        .catch(() => process.exit(1))
        .then(contexts => {
            // @ts-expect-error // Doesn't understand that we know `component` must have returned a context.
            if (doWatch) { return Promise.all(contexts.map(context => context.watch())) }
        });
}

/**
 * @param {string} root
 * @param {BuildOptions} [config]
 * @returns {BuildExecutor}
 */
function generatePluginBuild(root, config) {
    return generateNodeBuild({ entryPoints: [path.join(root, 'src', 'extension.ts')], outdir: path.join(root, 'out'), external: ['vscode'], ...config });
}

/**
 * @param {string} root
 * @param {BuildOptions} [config]
 * @returns {BuildExecutor}
 */
function generateWebviewBuild(root, config) {
    return async function (doWatch) {
        return buildOrWatch(doWatch, {
            bundle: true,
            format: 'iife',
            platform: 'browser',
            target: ['es2020'],
            entryPoints: [path.join(root, 'src', 'webview', 'main.ts')],
            outdir: path.join(root, 'out', 'webview'),
            ...CLIDefaultConfig,
            ...config
        });
    }
}

/**
 * @param {ESBuildConfig} config
 * @returns {BuildExecutor}
 */
function generateNodeBuild(config) {
    return function (doWatch) {
        return buildOrWatch(doWatch, {
            bundle: true,
            format: 'cjs',
            platform: 'node',
            target: ['es2020'],
            ...CLIDefaultConfig,
            ...config
        });
    }
}

const srcDir = path.join(__dirname, 'src');
const debugAdapterRoot = path.join(__dirname, 'node_modules', 'cdt-gdb-adapter', 'dist');
buildAndWatch({
    buildComponents: [
        generatePluginBuild(__dirname),
        generateWebviewBuild(__dirname, { entryPoints: [path.join(srcDir, 'memory', 'client', 'index.tsx')], outfile: path.join(__dirname, 'out', 'MemoryBrowser.js'), outdir: undefined, plugins: [sassPlugin()] }),
        generateNodeBuild({
            entryPoints: [path.join(debugAdapterRoot, 'debugAdapter.ts'), path.join(debugAdapterRoot, 'debugTargetAdapter.ts')],
            outdir: path.join(__dirname, 'out'),
            loader: { '.node': 'copy' }
        })
    ]
});
