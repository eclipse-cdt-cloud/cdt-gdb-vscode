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

export class MemoryServer {
    constructor(context: vscode.ExtensionContext) {
        context.subscriptions.push(
            vscode.commands.registerCommand('cdt.gdb.memory.open', () => this.openPanel(context))
        );
    }

    private openPanel(context: vscode.ExtensionContext) {
        const panel = vscode.window.createWebviewPanel(
            'cdtMemoryBrowser',
            'Memory Browser',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [ vscode.Uri.file(path.resolve(context.extensionPath, 'out'))]
            }
        )
        context.subscriptions.push(panel);

        panel.webview.onDidReceiveMessage(message => this.onDidReceiveMessage(message));

        panel.webview.html = `
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
    }

    private loadScript(context: vscode.ExtensionContext, path: string) {
        return `<script src="${vscode.Uri.file(context.asAbsolutePath(path)).with({ scheme: 'vscode-resource'}).toString()}"></script>`;
    }

    private onDidReceiveMessage(message: any) {

    }
}