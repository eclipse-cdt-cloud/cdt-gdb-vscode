# CDT GDB Debug Adapter Extension for vscode

This is an extension for vscode that supports debugging using gdb and any other debugger that supports the MI protocol. It is built by the experts that provide the gdb support in the Eclipse C/C++ IDE (CDT).

This extension provides a number of features that integrate into the vscode debug environment. This includes launch types, support for the standard debug views as well as a custom viewer for memory browsing.

## Prerequisites

External tools are expected to be present on your system depending on the intended use case.
* **Local GDB Debug**: A GDB installation is required on your system.
* **Remote GDB Debug**: A GDB installation is required on your system. In addition to that you must have either access to a running GDB server instance (`attach` use case), or a suitable GDB server variant must be installed to `launch` and connect to your debug target.

## Launch Configurations

This extension contributes two debugger types:
* `gdb`: Support for **Local GDB Debug**. Launch or attach to an already running application locally on your host machine using GDB.
* `gdbtarget`: Support for **Remote GDB Debug**. Launch or attach to an already running remote GDB server using GDB.

Both come as `launch` and `attach` request types, each with a sophisticated set of configuration settings.

### `gdb` Debugger Type

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


### `gdbtarget` Debugger Type

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

#### `imageAndSymbols` Object

Additional settings for loading images to the target and symbols into the debugger. This object can be used in `launch` and `attach` configurations for the `gdbtarget` debugger type for remote GDB connections.

|  Setting | `launch`  | `attach`  | Type | Description |
|:---|:---:|:---:|:---:|:---|
| `symbolFileName` | x | x | `string` | If specified, a symbol file to load at the given (optional) offset. Also see `symbolOffset`. |
| `symbolOffset` | x | x | `string` | If `symbolFileName` is specified, the offset added to symbol addresses when loaded. |
| `imageFileName` | x | x | `string` | If specified, an image file to load at the given (optional) offset. Also see `imageOffset`. |
| `imageOffset` | x | x | `string` | If `imageFileName` is specified, the offset used to load the image. |

#### `target` Object

Additional settings to configure the remote GDB target. This object can be used in `launch` and `attach` configurations for the `gdbtarget` debugger type for remote GDB connections.

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

The extension comes with a Memory Browser window. However, we have plans to deprecate and remove the window in favour of the Eclipse CDT Cloud [Memory Inspector](https://github.com/eclipse-cdt-cloud/vscode-memory-inspector) extension for vscode which is available from the [Microsoft Marketplace](https://marketplace.visualstudio.com/items?itemName=eclipse-cdt.memory-inspector) and the [Open VSX Registry](https://open-vsx.org/extension/eclipse-cdt/memory-inspector).

Any feedback on these plans is welcomed in the discussion in GitHub issue [#110](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/110).

## Contributions

We welcome any feedback and contributions on [GitHub](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode).

Please raise [GitHub issues](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/new?template=Blank+issue) to submit feedback, defect reports, and enhancement requests.

Check our [contribution guidelines](./CONTRIBUTING.md) for more information on how to contribute changes. And our [developer documentation](./DEVELOPMENT.md) for how to build and develop the extension.

This open-source project is part of [Eclipse CDT Cloud](https://eclipse.dev/cdt-cloud/).
