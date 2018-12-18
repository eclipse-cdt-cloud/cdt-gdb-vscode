# CDT GDB Visual Studio Code Extension

This is a Visual Studio Code extension that supports the CDT GDB Debug Adapter.
It supports the launch configurations for gdb.
It will also implement IDE side support for any debug adapter protocol extensions we need to make.

## Building

We're using yarn since yarn link works where npm link does not.

```
yarn
yarn build
```

## Development

When working on the adapter and the extension at the same time, you can use yarn link to link the adapter
into the extension's node_modules.

## Launching

I've included a launch.json with the typical Extension launch configuration predefined. Simply hit F5 to launch.

Still not sure how to debug the adapter itself. Any ideas there would be appreciated.
