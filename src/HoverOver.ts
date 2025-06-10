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

export class OwnHoverOver {
    constructor(context: ExtensionContext) {
        this.registerCallbacks(context);
    }

    private readonly registerCallbacks = (context: ExtensionContext) => {
        vscode.debug.onDidStartDebugSession((_session) => {
            const selector: vscode.DocumentSelector = [
                { scheme: 'file', language: 'cpp' },
                { scheme: 'file', language: 'c' },
                { scheme: 'file', language: 'c++' },
            ];

            const provider = vscode.languages.registerHoverProvider(selector, {
                async provideHover(document, position, _token) {
                    const wordRange = document.getWordRangeAtPosition(position);
                    const word = document.getText(wordRange);

                    const session = vscode.debug.activeDebugSession;
                    if (!session) {
                        return new vscode.Hover('No active debug session.');
                    }

                    try {
                        const result = await session.customRequest('evaluate', {
                            expression: word,
                            context: 'hover',
                        });
                        return new vscode.Hover(`${word} = ${result.result}`);
                    } catch (e) {
                        return new vscode.Hover(`${word}: failed to evaluate (${e})`);
                    }
                },
            });
            context.subscriptions.push(provider);
        });
    };
}
