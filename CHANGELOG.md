# Change Log

## 2.2.0

- Fixes [`#173`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/173): Add `target`>`watchServerProcess` setting to ignore early exit of `server` executable, e.g. if a launcher for actual gdbserver.
- Fixes [cdt-gdb-adapter`#367`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/367): Allow empty `program` setting for remote `launch`/`attach` and for local `attach` configurations.
- Fixes [cdt-gdb-adapter`#398`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/398): Add `target`>`serverDisconnectTimeout` setting to configure timeout for graceful gdbserver disconnect.
- Update to cdt-gdb-adapter v1.2.0
    - Fixes [`#173`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/173): Add `target`>`watchServerProcess` setting to ignore early exit of `server` executable, e.g. if a launcher for actual gdbserver.
    - Fixes [cdt-gdb-adapter `#330`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/330) / [`#151`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/151): Cannot remove breakpoint when debugging (Windows, Theia).
    - Fixes [cdt-gdb-adapter`#362`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/362): Cannot execute CLI commands like `> interrupt` from Debug Console while CPU is running.  
      **Note**: Depends on whether a blocking command was executed from CLI before.
    - Fixes [cdt-gdb-adapter`#367`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/367): Debugging with `gdbtarget` fails if `program` is omitted, despite user doc claiming it's optional.
    - Fixes [cdt-gdb-adapter`#398`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/398): Give gdbserver time to gracefully disconnect before terminating it.
    - Enhancement: Improve error message if setting more HW breakpoints than supported by target.
    - Enhancement: Improve error message on `-target-select` timeout on Windows.

## 2.1.0

- Adds [PR `#168`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/pull/168): Supported languages for `gdb` and `gdbtarget` debug adapter types to show `Open Disassembly View` context menu entry in source code editors.
- Implements [`#157`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/157): Update NPM dependencies, Node and Python requirements, and Typescript version.
- Update to cdt-gdb-adapter v1.1.0
    - [Fixes and robustness around remote target GDB connect, disconnect, and unexpected connection loss/termination of gdb and gdbserver.](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/361)
    - [Error handling for missing remote configuration like port.](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/384)
    - [Update NPM dependencies, Node and Python requirements, and Typescript version.](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/381)

## 2.0.6

- Fixes [`#161`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/161): Changed "Custom Reset" button tooltip to "Reset Target"
- Update to cdt-gdb-adapter v1.0.11
    - [Adds instruction breakpoint support to enable breakpoints in Disassembly View](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/373)

## 2.0.5

- Update to cdt-gdb-adapter v1.0.10
    - [Support GDB/MI breakpoint notifications](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/360)

## 2.0.4

- Update to cdt-gdb-adapter v1.0.8
    - [Optional device reset during debug session](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/359)
    - [Suppressing unneeded error message when hovering](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/366)

## 2.0.3

- Fixes [`#144`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/144): Error with the openGdbConsole option

## 2.0.2

- Update to cdt-gdb-adapter v1.0.6
    - [Hardware/Software Breakpoint Modes](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/350)
    - [Fixes step out to always step out of top frame](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/353)

## 2.0.1

- Update to cdt-gdb-adapter v1.0.4
    - [Add supportsEvaluateForHovers](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/347)
    - [Disassembly address handling improvement](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/348)

## 2.0.0

- First release to the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=eclipse-cdt.cdt-gdb-vscode) in addition to existing releases to the [Open VSX Registry](https://open-vsx.org/extension/eclipse-cdt/cdt-gdb-vscode).
- Updated extension logo.
- Updated user and repository documentation.
