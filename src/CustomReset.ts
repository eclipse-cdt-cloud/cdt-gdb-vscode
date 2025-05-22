/*********************************************************************
 * Copyright (c) 2025 Arm Ltd. and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

export class CustomReset {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
        this.registerCallbacks();
    }

    private readonly registerCallbacks = () => {
        vscode.debug.onDidStartDebugSession((session) => {
            const hasCustomReset =
                Array.isArray(session.configuration?.customResetCommands) &&
                session.configuration.customResetCommands.length > 0;
            vscode.commands.executeCommand(
                'setContext',
                'cdt.debug.hasCustomReset',
                hasCustomReset
            );
        });

        vscode.debug.onDidTerminateDebugSession(() => {
            vscode.commands.executeCommand(
                'setContext',
                'cdt.debug.hasCustomReset',
                false
            );
        });
    };

    private readonly registerCommands = (context: ExtensionContext) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'cdt.debug.customReset',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        await session.customRequest(
                            'cdt-gdb-adapter/customReset'
                        );
                    }
                }
            )
        );
    };
}
