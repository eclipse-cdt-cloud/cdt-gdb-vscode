# Change Log

## Unreleased

- Fixes [``](): Cannot set breakpoints in assembler files.

## 2.4.1

- Fixes [`184`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/184): Add `auxiliaryGdb` setting to `attach` type for `gdbtarget`.
- Update to cdt-gdb-adapter v1.4.1
    - Fixes [cdt-gdb-adapter `400`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/400): Evaluation of variables to support RTOS Views extension.

## 2.4.0

- Implements [cdt-gdb-adapter `#442`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/442): Support auxiliary GDB connections to allow selected operations while CPU running.
- Update to cdt-gdb-adapter v1.4.0
    - Implements [cdt-gdb-adapter `#442`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/442): Support auxiliary GDB connections to allow selected operations while CPU running.
    - Completes [cdt-gdb-adapter `#422`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/422): Support data breakpoints for complex data types.
    - Fixes [cdt-gdb-adapter `#439`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/439): Missing thread names when attaching to targets that don’t stop on attach.
    - Fixes [cdt-gdb-adapter `#440`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/440): Automatically disable async mode in adapter if debug target does not support it.

## 2.3.0

- Documentation update: Clarify behavior of `initCommands` setting for `gdbtarget` type.
- Update to cdt-gdb-adapter v1.3.0
    - Implements [cdt-gdb-adapter `#422`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/422): Initial support for data breakpoints.
      **Note**: Initially supports global symbols with simple datatypes.
    - Fixes [cdt-gdb-adapter `#402`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/402): Better handle setting too many breakpoints.
    - Fixes [cdt-gdb-adapter `#407`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/407): Getting stuck on concurrent breakpoint setup on targets that don’t stop on attach.
    - Fixes [cdt-gdb-adapter `#408`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/408): Avoid unnecessary ThreadInfoRequests.
    - Fixes [cdt-gdb-adapter `#420`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/420): Disabling evaluate request error messages when hovering over comments.
    - Fixes [cdt-gdb-adapter `#427`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/427): Breakpoint source code reference to module disappears when breakpoint is hit.
    - Fixes [cdt-gdb-adapter `#428`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/428): User experience issues in step operations on slow sessions.
    - Fixes [cdt-gdb-adapter `#437`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/437): `detach` request getting stuck on exited program.
    - Fixes [cdt-gdb-adapter `#444`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/pull/444): Adding more robustness to warning messages of the evaluateRequest.

## 2.2.0

- Fixes [`#173`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/173): Add `target`>`watchServerProcess` setting to ignore early exit of `server` executable, e.g. if a launcher for actual gdbserver.
- Fixes [cdt-gdb-adapter `#367`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/367): Allow empty `program` setting for remote `launch`/`attach` and for local `attach` configurations.
- Fixes [cdt-gdb-adapter `#398`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/398): Add `target`>`serverDisconnectTimeout` setting to configure timeout for graceful gdbserver disconnect.
- Update to cdt-gdb-adapter v1.2.0
    - Fixes [`#173`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/173): Add `target`>`watchServerProcess` setting to ignore early exit of `server` executable, e.g. if a launcher for actual gdbserver.
    - Fixes [cdt-gdb-adapter `#330`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/330) / [`#151`](https://github.com/eclipse-cdt-cloud/cdt-gdb-vscode/issues/151): Cannot remove breakpoint when debugging (Windows, Theia).
    - Fixes [cdt-gdb-adapter `#362`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/362): Cannot execute CLI commands like `> interrupt` from Debug Console while CPU is running.  
      **Note**: Depends on whether a blocking command was executed from CLI before.
    - Fixes [cdt-gdb-adapter `#367`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/367): Debugging with `gdbtarget` fails if `program` is omitted, despite user doc claiming it's optional.
    - Fixes [cdt-gdb-adapter `#398`](https://github.com/eclipse-cdt-cloud/cdt-gdb-adapter/issues/398): Give gdbserver time to gracefully disconnect before terminating it.
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
