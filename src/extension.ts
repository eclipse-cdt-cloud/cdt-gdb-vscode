/*********************************************************************
 * Copyright (c) 2018 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ExtensionContext, commands, window } from 'vscode';

export function activate(context: ExtensionContext) {
    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askProgramPath', config => {
            return window.showInputBox({
                placeHolder: "Please enter the path to the program"
            });
        })
    );

    context.subscriptions.push(
        commands.registerCommand('cdt.debug.askProcessId', config => {
            return window.showInputBox({
                placeHolder: "Please enter ID of process to attach to"
            });
        })
    );
}

export function deactivate() {

}