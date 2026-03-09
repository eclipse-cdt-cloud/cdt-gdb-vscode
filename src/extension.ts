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
import { CustomReset } from './CustomReset';
export { CustomReset } from './CustomReset';

let valueFormatSupported = false;
export function activate(context: ExtensionContext) {
    new MemoryServer(context);
    new ResumeAllSession(context);
    new SuspendAllSession(context);
    new CustomReset(context);

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
    
    debug.registerDebugAdapterTrackerFactory('*', {
      createDebugAdapterTracker() {
        return {
              // From vscode to debug adapter  
              onWillReceiveMessage: (message) => {
                  // Check if the message is an evaluate request. If so, add property format to it
                  if (message.command === 'evaluate' && message.arguments.expression.trim().endsWith(',x') && valueFormatSupported) {
                      message.arguments.format = { 
                          // Add all the formats you want to support here
                          hex: true, 
                      };
                      message.arguments.expression = message.arguments.expression.trim().slice(0, -2); // Remove the ,x from the expression
                  }
                },
              // From debug adapter to vscode
              onDidSendMessage: (message) => {
                  if(message.command === 'initialize' && message.body.supportsValueFormattingOptions) {
                      valueFormatSupported = true;
                  }
              }
            }
        }
    });
}

export function deactivate() {
    // empty, nothing to do on deactivating extension
}
