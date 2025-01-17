# VS Code Debug Extension for GDB

> Note: This is a preliminary milestone release. Please help us by trying out this extension and providing feedback using [our github issues page](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues).

This is a Visual Studio Code extension that supports debugging using gdb and any other debugger that supports the MI protocol. It is built by the experts that provide the gdb support in the Eclipse C/C++ IDE (CDT).

This extension provides a number of features that integrate into the Visual Studio Code debug environment. This includes launch types, support for the standard debug views as well as a custom viewer for memory browsing.

## Prerequisites

External tools are expected to be present on your system depending on the intended use case.
* **Local GDB Debug**: A GDB installation is required on your system.
* **Remote GDB Debug**: A GDB installation is required on your system. In addition to that you must have either access to a running GDB server instance (`attach` use case), or a suitable GDB server variant must be installed to `launch` and connect to your debug target.

## Launch Configurations

The Visual Studio Debug Extension for GDB contributes two debugger types:
* `gdb`: Support for **Local GDB Debug**. Launch or attach to an already running application locally on your host machine using GDB.
* `gdbtarget`: Support for **Remote GDB Debug**. Launch or attach to an already running remote GDB server using GDB.

Both come as `launch` and `attach` request types, each with a sophisticated set of configuration settings.

### `gdb` Type

Launch and attach configuration settings that can be used with the `gdb` debugger type for local GDB debug.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `gdb` | x | x | `string` | Path to GDB. This can be an absolute path or the name of an executable on your PATH environment variable.<br>Default: `gdb` |
| `cwd` | x | x | `string` | Current working directory for launching GDB.<br>Default: Directory of the debugged `program`. |
| `environment` | x | x | `object` | Environment variables to use when launching GDB, defined as a key-value pairs. Use `null` value to remove variable.<br>Example:<pre>\"environment\": {<br>  \"VARNAME\": \"value\",<br>  \"PATH\": \"/new/item:${env:PATH}\",<br>  \"REMOVEME\": null<br>}</pre> |
| `program` | x | x | `string` | Path to the program to be debugged. For `launch` requests, this program is also launched.<br>Default: `${workspaceFolder}/${command:askProgramPath}`, which allows to interactively enter the full program path.  |
| `arguments` | x | | `string` | Arguments for the program. |
| `processId` | | x | `string` | Process ID to attach to. |
| `gdbAsync` | x | x | `boolean` | Use `mi-async` mode for communication with GDB. Always `true` if `gdbNonStop` is `true`.<br>Default: `true` |
| `gdbNonStop` | x | x | `boolean` | Use `non-stop` mode for controlling multiple threads.<br> Default: `false` |
| `verbose` | x | x | `boolean` | Produce verbose log output. |
| `logFile` | x | x | `string` | Absolute path to the file to log interaction with GDB.|
| `openGdbConsole` | x | x | `boolean` | *(UNIX-only)* Open a GDB console in your IDE while debugging. |
| `initCommands` | x | x | `string[]` | List of GDB commands sent before attaching to inferior. |


### `gdbtarget` Type

Launch and attach configuration settings that can be used with the `gdbtarget` debugger type for remote GDB debug connections.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `gdb` | x | x | `string` | Path to GDB. This can be an absolute path or the name of an executable on your PATH environment variable.<br>Default: `gdb` |
| `cwd` | x | x | `string` | Current working directory for launching GDB.<br>Default: Directory of the debugged `program`. |
| `environment` | x | x | `object` | Environment variables to use when launching GDB, defined as a key-value pairs. Use `null` value to remove variable.<br>Example:<pre>\"environment\": {<br>  \"VARNAME\": \"value\",<br>  \"PATH\": \"/new/item:${env:PATH}\",<br>  \"REMOVEME\": null<br>}</pre> |
| `program` | x | x | `string` | Path to the program to be debugged. For `launch` requests, this program is also launched.<br>Default: `${workspaceFolder}/${command:askProgramPath}`, which allows to interactively enter the full program path.<br>**Note**: While `program` is marked as required, the debug adapter launches anyway for remote GDB connections. For example to inspect an embedded target system's memory and other hardware resources without debugging a program.  |
| `gdbAsync` | x | x | `boolean` | Use `mi-async` mode for communication with GDB. Always `true` if `gdbNonStop` is `true`.<br>Default: `true` |
| `gdbNonStop` | x | x | `boolean` | Use `non-stop` mode for controlling multiple threads.<br> Default: `false` |
| `verbose` | x | x | `boolean` | Produce verbose log output. |
| `logFile` | x | x | `string` | Absolute path to the file to log interaction with GDB.|
| `openGdbConsole` | x | x | `boolean` | *(UNIX-only)* Open a GDB console in your IDE while debugging. |
| `initCommands` | x | x | `string[]` | List of GDB commands sent before attaching to inferior. |
| `preRunCommands` | x | x | `string[]` | List of GDB commands sent after loading image on target before resuming target. |
| `imageAndSymbols` | x | x | `object` | Additional settings for loading images to the target and symbols into the debugger. See section "`imageAndSymbols` object" for details.
| `target` | x | x |  `object` | Additional settings to configure the remote GDB target. See section "`target` object" for details. |

#### `imageAndSymbols` object

Additional settings for loading images to the target and symbols into the debugger. This object can be used in `launch` and `attach` configurations for the `gdbtarget` debugger type for remote GDB connections.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `symbolFileName` | x | x | `string` | If specified, a symbol file to load at the given (optional) offset. Also see `symbolOffset`. |
| `symbolOffset` | x | x | `string` | If `symbolFileName` is specified, the offset added to symbol addresses when loaded. |
| `imageFileName` | x | x | `string` | If specified, an image file to load at the given (optional) offset. Also see `imageOffset`. |
| `imageOffset` | x | x | `string` | If `imageFileName` is specified, the offset used to load the image. |

#### `target` object

Additional settings for loading images to the target and symbols into the debugger. This object can be used in `launch` and `attach` configurations for the `gdbtarget` debugger type for remote GDB connections.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `type` | x | x | `string` | The kind of target debugging to do. This is passed to `-target-select`.<br>Default: `remote` |
| `parameters` | x | x | `string[]`| Target parameters for the type of target. Normally something like `localhost:12345`.<br>Default: `${host}:${port}`. |
| `host` | x | x | `string` | Target host to connect to. Ignored if `parameters` is set.<br>Default: `localhost` |
| `port` | x | x | `string` | Target port to connect to. Ignored if `parameters` is set.<br>Default: Value captured by `serverPortRegExp`, otherwise defaults to `2331` |
| `cwd` | x | | `string` | Specifies the working directory of the server.<br>Default: Working directory of GDB |
| `environment` | x | | `object` | Environment variables to use when launching server, defined as key-value pairs. Defaults to the environment used to launch GDB. Use `null` value to remove variable.<br>Example:<pre>\"environment\": {<br>  \"VARNAME\": \"value\",<br>  \"PATH\": \"/new/item:${env:PATH}\",<br>  \"REMOVEME\": null<br>}</pre> |
| `server` | x | | `string` | The executable for the target server to launch (e.g. `gdbserver` or `JLinkGDBServerCLExe`). This can be an absolute path or the name of an executable on your PATH environment variable.<br>Default: `gdbserver` |
| `serverParameters` | x | | `string[]` | Command line arguments passed to server.<br>Default: `--once :0 ${args.program}` |
| `serverPortRegExp` | x | | `string` | Regular expression to extract `port` from by examining stdout/stderr of the GDB server. Once the server is launched, `port` will be set to this if unspecified. Defaults to matching a string like `Listening on port 41551` which is what `gdbserver` provides. Ignored if `port` or `parameters` is set. |
| `serverStartupDelay` | x | | `number` | Delay, in milliseconds, after startup but before continuing launch. If `serverPortRegExp` is provided, it is the delay after that regexp is seen. |
| `automaticallyKillServer` | x | | `boolean` | Automatically terminate the launched server when client issues a disconnect.<br>Default: `true` |
| `uart` | x | x | `object` | Settings related to displaying UART output in the debug console. |

##### `uart` object

Settings related to displaying UART output in the debug console. This object can be used in the `target` object of `launch` and `attach` configurations for the `gdbtarget` debugger type for remote GDB connections.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `serialPort` | x | x | `string` | Path to the serial port connected to the UART on the board. |
| `socketPort` | x | x | `string` | Target TCP port on the host machine to attach socket to print UART output.<br>Default: `3456` |
| `baudRate` | x | x | `number` | Baud Rate (in bits/s) of the serial port to be opened.<br>Default: `115200`.|
| `characterSize` | x | x | `number` | The number of bits in each character of data sent across the serial line.<br>Supported values: `5`, `6`, `7`, `8`<br>Default: `8` |
| `parity` | x | x | `string` | The type of parity check enabled with the transmitted data.<br>Supported values: `none`, `odd`, `even`, `mark`, `space`<br>Default: `none` - no parity bit sent |
| `stopBits` | x | x | `number` | The number of stop bits sent to allow the receiver to detect the end of characters and resynchronize with the character stream.<br>Supported values: `1`, `1.5`, `2`<br>Default: `1` |
| `handshakingMethod` | x | x | `string` | The handshaking method used for flow control across the serial line.<br>Supported values: `none`, `XON/XOFF`, `RTS/CTS`<br>Default: `none` - no handshaking |
| `eolCharacter` | x | x | `string` | The EOL character used to parse the UART output line-by-line.<br>Supported values: `LF`, `CRLF`<br>Default: `LF` |

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
