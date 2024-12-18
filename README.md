# VS Code Debug Extension for GDB

> Note: This is a preliminary milestone release. Please help us by trying out this extension and providing feedback using [our github issues page](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues).

This is a Visual Studio Code extension that supports debugging using gdb and any other debugger that supports the MI protocol. It is built by the experts that provide the gdb support in the Eclipse C/C++ IDE (CDT).

This extension provides a number of features that integrate into the Visual Studio Code debug environment. This includes launch types, support for the standard debug views as well as a custom viewer for memory browsing.

## Launch Settings

TODO

## Memory Browser

TODO

## Building

### Building the extension

We use yarn to as our package manager. To build, simply do

```
yarn
yarn build
```

You can also run the build in watch mode using

```
yarn watch
```

### Co-developing cdt-gdb-adapter

If you are working on the cdt-gdb-adapter you can check it out to a different location and then link it in.

From the cdt-gdb-adapter project run

```
yarn link
```

Then from this project run

```
yarn link cdt-gdb-adapter
```

You can set up a VS Code workspace that has both folders. Also make sure you have builds running in each folder to pick up updates (e.g. `yarn watch`).

The way to debug cdt-gdb-adapter works with the same principle as the example Mock Debug Adapter provided by VSCode.
For detailed instructions please refer to [Development Setup for Mock Debug](https://code.visualstudio.com/api/extension-guides/debugger-extension#development-setup-for-mock-debug).

The short step-by-step version is:

1. Launch this extension with the `Extension` launch configuration ([cdt-gdb-vscode's launch.json](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/blob/004a59f329136c2d5eb23e11e54b1f3f51b4d197/.vscode/launch.json#L8))
2. Launch cdt-gdb-adapter in server mode with either `Server` or `Server (Target adapter)` depending on whether you want to use local debugging or target debugging, corresponding to `"type": "gdb"` and `"type": "gdbtarget"` respectively. ([cdt-gdb-adapter's launch.json](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/92bb15046fea82256742a69f0b240129a1949a76/.vscode/launch.json#L4-L21))
3. Add a breakpoint somewhere useful, such as [`launchRequest`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/blob/6ba0de8e466f4953501181f53ecdfb14c7988973/src/desktop/GDBTargetDebugSession.ts#L94)
4. Add `"debugServer": 4711` to the launch configuration in the extension development host. The `4711` is the port number that cdt-gdb-adapter is listening on.
5. Debug the C/C++ program in the extension development host.
