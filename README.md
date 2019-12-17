# VS Code Debug Extension for GDB

> Note: This is a preliminary milestone release. Please help us by trying out this extension and providing feedback using [our github issues page](https://github.com/eclipse-cdt/cdt-gdb-vscode/issues).

This is a Visual Studio Code extension that supports debugging using gdb and any other debugger that supports the MI protocol. It is built by the experts that provide the gdb support in the Eclipse C/C++ IDE (CDT).

This extension provides a number of features that integrate  into the Visual Studio Code debug environment. This includes launch types, support for the standard debug views as well as a custom viewer for memory browsing.

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
You can set up a VS Code workspace that has both folders. Also make sure you have builds running in each folder to pick up updates.
