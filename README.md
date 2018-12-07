# CDT GDB Visual Studio Code Extension

This is a Visual Studio Code extension that supports the CDT GDB Debug Adapter.
It supports the launch configurations for gdb.
It will also implement IDE side support for any debug adapter protocol extensions we need to make.

## Building

We include the cdt-gdb-adapter as a git submodule here. Make sure you recursively clone or submodule update to get it.

Then you're good to go.

```
npm install
npm run build
```

## Launching

I've included a launch.json with the typical Extension launch configuration predefined. Simply hit F5 to launch.

Still not sure how to debug the adapter itself. Any ideas there would be appreciated.
