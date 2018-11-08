# CDT GDB Visual Studio Code Extension

This is a Visual Studio Code extension that supports the CDT GDB Debug Adapter.
It supports the launch configurations for gdb.
It will also implement IDE side support for any debug adapter protocol extensions we need to make.

## Building

For now, we have the debug adapter as a submodule. This allows us to work on and test both at the same time. Once things mature, we'll switch to pull the adapter out of npm as a proper dependency.

The build uses webpack. We duplicate the debug adapter build and add in the vscode extension build resulting in two bundles, gdbDebugAdapter.js and extension.js.

```
npm install
npm run build
```
