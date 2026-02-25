/*********************************************************************
 * Copyright (c) 2026 Arm and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';

export class SwitchRadix {
    constructor(context: vscode.ExtensionContext) {
        this.registerCommands(context);
    }

    private readonly registerCommands = (context: vscode.ExtensionContext) => {
        const setOutputRadixToHexCommand = vscode.commands.registerCommand(
            'cdt.debug.setOutputRadixToHex',
            () => this.handleSetOutputRadixToHex(),
        );

        const setOutputRadixToDecimalCommand = vscode.commands.registerCommand(
            'cdt.debug.setOutputRadixToDecimal',
            () => this.handleSetOutputRadixToDecimal(),
        );
        context.subscriptions.push(
            setOutputRadixToHexCommand,
            setOutputRadixToDecimalCommand,
        );
    };

    private async handleSetOutputRadixToHex() {
        const activeSession = vscode.debug.activeDebugSession;
        const args: DebugProtocol.EvaluateArguments = {
            expression: '> set output-radix 16',
            frameId: undefined, // Currently required by CDT GDB Adapter
            context: 'repl',
        };
        try {
            (await activeSession?.customRequest(
                'evaluate',
                args,
            )) as DebugProtocol.EvaluateResponse['body'];
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to set output radix to hex: ${error}`,
            );
        }
    }

    private async handleSetOutputRadixToDecimal() {
        const activeSession = vscode.debug.activeDebugSession;
        const args: DebugProtocol.EvaluateArguments = {
            expression: '> set output-radix 10',
            frameId: undefined, // Currently required by CDT GDB Adapter
            context: 'repl',
        };
        try {
            await activeSession?.customRequest('evaluate', args);
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to set output radix to decimal: ${error}`,
            );
        }
    }
}
