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
import {
    ClientRequest,
    ServerResponse,
    ReadMemory,
    ChildDapNamesClientRequest,
    ChildDapNamesServerResponse,
    GetChildDapNames,
} from '../common/messages';
import { MemoryContents } from 'cdt-gdb-adapter';
import { ChildDapContents } from 'cdt-amalgamator';

export class MemoryServer {
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand('cdt.gdb.memory.open', () =>
                this.openPanel(context)
            )
        );
    }

    private openPanel(context: vscode.ExtensionContext) {
        const newPanel = vscode.window.createWebviewPanel(
            'cdtMemoryBrowser',
            'Memory Browser',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(
                        path.resolve(context.extensionPath, 'dist')
                    ),
                ],
                retainContextWhenHidden: true,
            }
        );
        context.subscriptions.push(newPanel);

        newPanel.webview.onDidReceiveMessage((message) => {
            this.onDidReceiveMessage(message, newPanel);
        });

        newPanel.webview.html = `
             <html>
                 <head>
                     <meta charset="utf-8">
                     <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                     <link href="${newPanel.webview.asWebviewUri(
                         vscode.Uri.joinPath(
                             context.extensionUri,
                             'dist/MemoryBrowser.css'
                         )
                     )}" type="text/css" rel="stylesheet"></link>
                 </head>
                 <body>
                     <div id="app"></div>
                     <script src="${newPanel.webview
                         .asWebviewUri(
                             vscode.Uri.joinPath(
                                 context.extensionUri,
                                 'dist/MemoryBrowser.js'
                             )
                         )
                         .toString()}"></script>
                 </body>
             </html>
         `;
    }

    private onDidReceiveMessage(
        request: ClientRequest | ChildDapNamesClientRequest,
        panel: vscode.WebviewPanel
    ) {
        switch (request.command) {
            case 'ReadMemory':
                this.handleReadMemory(request, panel);
                break;
            case 'getChildDapNames':
                this.handleGetChildDapNames(request, panel);
                break;
        }
    }

    private sendResponse(
        panel: vscode.WebviewPanel,
        request: ClientRequest | ChildDapNamesClientRequest,
        response: Partial<ServerResponse | ChildDapNamesServerResponse>
    ) {
        if (panel) {
            response.token = request.token;
            response.command = request.command;
            panel.webview.postMessage(response);
        }
    }

    private async handleReadMemory(
        request: ReadMemory.Request,
        panel: vscode.WebviewPanel
    ) {
        const session = vscode.debug.activeDebugSession;
        if (session) {
            try {
                const result: MemoryContents = await session.customRequest(
                    request.args.child === undefined
                        ? 'cdt-gdb-adapter/Memory'
                        : 'cdt-amalgamator/Memory',
                    request.args
                );
                this.sendResponse(panel, request, {
                    result,
                });
            } catch (err) {
                this.sendResponse(panel, request, {
                    err: err + '',
                });
            }
        } else {
            this.sendResponse(panel, request, {
                err: 'No Debug Session',
            });
        }
    }

    private async handleGetChildDapNames(
        request: GetChildDapNames.Request,
        panel: vscode.WebviewPanel
    ) {
        const session = vscode.debug.activeDebugSession;
        if (session) {
            try {
                const result: ChildDapContents = await session.customRequest(
                    'cdt-amalgamator/getChildDapNames'
                );
                this.sendResponse(panel, request, {
                    result,
                });
            } catch (err) {
                this.sendResponse(panel, request, {
                    err: err + '',
                });
            }
        } else {
            this.sendResponse(panel, request, {
                err: 'No Debug Session',
            });
        }
    }
}
