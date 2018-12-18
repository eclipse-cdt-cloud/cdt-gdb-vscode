# CDT GDB Visual Studio Code Extension

This is a Visual Studio Code extension that supports the CDT GDB Debug Adapter.
It supports the launch configurations for gdb.
It will also implement IDE side support for any debug adapter protocol extensions we need to make.

## Building

This extension uses the cdt-gdb-adapter. It is still under initial development. It needs to be checked
out of git in it's own directory. Once that is done, use npm link to link it into this project.

Then you're good to go.

```
npm install
npm run build
```

## Launching

I've included a launch.json with the typical Extension launch configuration predefined. Simply hit F5 to launch.

Still not sure how to debug the adapter itself. Any ideas there would be appreciated.
