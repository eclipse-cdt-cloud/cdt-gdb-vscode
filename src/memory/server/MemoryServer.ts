/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import * as vscode from 'vscode';
import * as path from 'path';
import { ClientRequest, ServerResponse, ReadMemory } from '../common/messages';
import { MemoryContents } from 'cdt-gdb-adapter';

export class MemoryServer {
    private panel?: vscode.WebviewPanel;

    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand('cdt.gdb.memory.open', () =>
                this.openPanel(context)
            )
        );
    }

    private openPanel(context: vscode.ExtensionContext) {
        let newPanel: vscode.WebviewPanel;
        newPanel = vscode.window.createWebviewPanel(
            'cdtMemoryBrowser',
            'Memory Browser',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.resolve(context.extensionPath, 'out')),
                ],
                retainContextWhenHidden: true,
            }
        );
        context.subscriptions.push(newPanel);

        newPanel.webview.onDidReceiveMessage((message) => {
            this.panel = newPanel;
            this.onDidReceiveMessage(message);
        });

        newPanel.webview.html = `
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                </head>
                <body>
                    <div id="app"></div>
                    ${this.loadScript(context, 'out/vendor.js')}
                    ${this.loadScript(context, 'out/MemoryBrowser.js')}
                </body>
            </html>
        `;

        // Reset when panel is disposed
        newPanel.onDidDispose(
            () => {
                this.panel = newPanel;
                this.panel = undefined;
            },
            null,
            context.subscriptions
        );
    }

    private loadScript(context: vscode.ExtensionContext, path: string) {
        return `<script src="${vscode.Uri.file(context.asAbsolutePath(path))
            .with({ scheme: 'vscode-resource' })
            .toString()}"></script>`;
    }

    private onDidReceiveMessage(request: ClientRequest) {
        switch (request.command) {
            case 'ReadMemory':
                this.handleReadMemory(request);
                break;
        }
    }

    private sendResponse(
        request: ClientRequest,
        response: Partial<ServerResponse>
    ) {
        if (this.panel) {
            response.token = request.token;
            response.command = request.command;
            this.panel.webview.postMessage(response);
        }
    }

    private async handleReadMemory(request: ReadMemory.Request) {
        const session = vscode.debug.activeDebugSession;
        if (session) {
            try {
                const result: MemoryContents = await session.customRequest(
                    'cdt-gdb-adapter/Memory',
                    request.args
                );
                this.sendResponse(request, {
                    result,
                });
            } catch (err) {
                this.sendResponse(request, {
                    err: err + '',
                });
            }
        } else {
            this.sendResponse(request, {
                err: 'No Debug Session',
            });
        }
    }
}
