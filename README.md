# CDT GDB Visual Studio Code Extension

This is a Visual Studio Code extension that supports the CDT GDB Debug Adapter.
It supports the launch configurations for gdb.
It will also implement IDE side support for any debug adapter protocol extensions we need to make.

## Building

Do an ```npm install``` to fetch the dependencies.

The extension currently depends on having the cdt-gdb-adapter available in source form in one of these places and checks in this order.
- Location pointed to by ```CDT_ADAPTER_DIR``` environment variable
- From sibling directory ```../cdt-gdb-adapter```
- The github npm dependency in ```node_modules/cdt-gdb-adapter```

After that, the build is pretty simple. It uses webpack to bundle the extension and the adapter into the ```out``` directory.

```
npm run build
```

## Launching

I've included a launch.json with the typical Extension launch configuration predefined. Simply hit F5 to launch.

Still not sure how to debug the adapter itself. Any ideas there would be appreciated.
