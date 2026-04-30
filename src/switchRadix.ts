/*********************************************************************
 * Copyright (c) 2026 Arm Limited and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';

type Radix = 'hexadecimal' | 'decimal';

export class SwitchRadix {
    private _sessionsMap: Map<string, Radix> = new Map();
    constructor(context: vscode.ExtensionContext) {
        vscode.debug.onDidChangeActiveDebugSession((session) => this.setCurrentRadixContext(session));
        vscode.debug.onDidStartDebugSession((session) => this.addCurrentRadixContext(session));
        vscode.debug.onDidTerminateDebugSession((session) => this._sessionsMap.delete(session.id));
        vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
        this.registerCommands(context);
    }

    private addCurrentRadixContext(session: vscode.DebugSession) {
        if (!this._sessionsMap.has(session.id)) {
            this._sessionsMap.set(session.id, 'decimal');
            vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
        }
    }

    private setCurrentRadixContext(session: vscode.DebugSession | undefined) {
        if (!session) {
            return;
        }
        // Check if the session is already in the map
        const existingSessionRadix = this._sessionsMap.get(session.id);
        if (existingSessionRadix) {
            vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', existingSessionRadix);
            this.handleSetOutputRadix(existingSessionRadix);
            return;
        }
    }
    private async registerCommands(context: vscode.ExtensionContext) {
        const setOutputRadixToHexCommand = vscode.commands.registerCommand(
            'cdt.debug.setOutputRadixToHex',
            async () => {
                await this.handleSetOutputRadix('hexadecimal');
                const activeSession = vscode.debug.activeDebugSession;
                if (activeSession) {
                    this._sessionsMap.set(activeSession.id, 'hexadecimal');
                }
                await vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'hexadecimal');
            },
        );

        const setOutputRadixToDecimalCommand = vscode.commands.registerCommand(
            'cdt.debug.setOutputRadixToDecimal',
            async () => {
                await this.handleSetOutputRadix('decimal');
                const activeSession = vscode.debug.activeDebugSession;
                if (activeSession) {
                    this._sessionsMap.set(activeSession.id, 'decimal');
                }
                await vscode.commands.executeCommand('setContext', 'cdt.debug.outputRadix', 'decimal');
            },
        );
        context.subscriptions.push(
            setOutputRadixToHexCommand,
            setOutputRadixToDecimalCommand,
        );
    }

    private async handleSetOutputRadix(radix: Radix) {
        const activeSession = vscode.debug.activeDebugSession;
        const args: DebugProtocol.EvaluateArguments = {
            expression: `> set output-radix ${radix === 'hexadecimal' ? 16 : 10}`,
            context: 'repl',
        };
        try {
            await activeSession?.customRequest(
                'evaluate',
                args,
            );
        } catch (error) {
            vscode.window.showErrorMessage(
                `Failed to set output radix to ${radix}: ${error}`,
            );
        }
    }
}
