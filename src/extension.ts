/*********************************************************************
 * Copyright (c) 2018 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ExtensionContext, commands, window, debug } from 'vscode';
import { MemoryServer } from './memory/server/MemoryServer';
export { MemoryServer } from './memory/server/MemoryServer';
import { ResumeAllSession } from './ResumeAllSession';
export { ResumeAllSession } from './ResumeAllSession';
import { SuspendAllSession } from './SuspendAllSession';
export { SuspendAllSession } from './SuspendAllSession';


export function activate(context: ExtensionContext) {
    new MemoryServer(context);
    new ResumeAllSession(context);
    new SuspendAllSession(context);

    debug.onDidReceiveDebugSessionCustomEvent(event => {
        if (event.event === "UpdateBreakpointView") {
          const bps = debug.breakpoints;
          debug.removeBreakpoints(bps);
          debug.addBreakpoints(bps);
        }
      });

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askProgramPath', (_config) => {
            return window.showInputBox({
                placeHolder: 'Please enter the path to the program',
            });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askProcessId', (_config) => {
            return window.showInputBox({
                placeHolder: 'Please enter ID of process to attach to',
            });
        })
    );
}

export function deactivate() {
    // empty, nothing to do on deactivating extension
}
