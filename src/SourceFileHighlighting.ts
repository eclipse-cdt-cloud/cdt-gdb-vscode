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

export class SourceFileHighlighting {
    private activeDebugSession: vscode.DebugSession | undefined;
    private context: vscode.ExtensionContext;
    private executableLineDecorator =
        vscode.window.createTextEditorDecorationType({
            borderWidth: '0 0 0 2px',
            borderStyle: 'solid',
            borderColor: new vscode.ThemeColor('editorLineNumber.foreground'),
            isWholeLine: true,
        });

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public activate(): void {
        this.registerToEvents();
    }

    private registerToEvents(): void {
        const onDidChangeActiveDebugSessionDisposable =
            vscode.debug.onDidChangeActiveDebugSession((session) => {
                if (!session) {
                    this.clearExecutableLineDecorations(
                        vscode.window.visibleTextEditors
                    );
                }
                if (session?.type !== 'gdb' && session?.type !== 'gdbtarget') {
                    this.clearExecutableLineDecorations(
                        vscode.window.visibleTextEditors
                    );
                }
                this.activeDebugSession = session;
                this.handleOnDidChangeActiveTextEditor(
                    vscode.window.activeTextEditor
                );
            });
        const onDidChangeActiveTextEditorDisposable =
            vscode.window.onDidChangeActiveTextEditor((editor) => {
                this.handleOnDidChangeActiveTextEditor(editor);
            });

        this.context.subscriptions.push(
            onDidChangeActiveDebugSessionDisposable,
            onDidChangeActiveTextEditorDisposable
        );
    }

    private clearExecutableLineDecorations(
        editors: readonly vscode.TextEditor[]
    ): void {
        for (const editor of editors) {
            editor.setDecorations(this.executableLineDecorator, []);
        }
    }

    private async handleOnDidChangeActiveTextEditor(
        editor: vscode.TextEditor | undefined
    ): Promise<void> {
        if (!editor) {
            return;
        }
        if (!this.activeDebugSession) {
            this.clearExecutableLineDecorations([editor]);
            return;
        }
        const breakpointLocations = await this.getBreakpointLocations(editor);
        if (!breakpointLocations) {
            this.clearExecutableLineDecorations([editor]);
            return;
        }
        const executableLines = new Set(
            breakpointLocations.breakpoints.map(
                (bp: DebugProtocol.BreakpointLocation) => bp.line
            )
        );
        const decorations: vscode.DecorationOptions[] = Array.from(
            executableLines
        ).map((exeline: number) => {
            const line = exeline - 1; // Convert to 0-based index
            return {
                range: new vscode.Range(line, 0, line, 0),
            };
        });
        editor.setDecorations(this.executableLineDecorator, decorations);
    }

    private async getBreakpointLocations(
        editor: vscode.TextEditor
    ): Promise<DebugProtocol.BreakpointLocationsResponse['body'] | void> {
        if (editor.document.uri.scheme !== 'file') {
            return;
        }
        const currentSourceFile = editor.document.fileName;
        const args: DebugProtocol.BreakpointLocationsArguments = {
            source: { path: currentSourceFile },
            line: 1,
            endLine: editor.document.lineCount, // Requesting breakpoint locations for the whole file
        };
        const breakpointLocations =
            await this.activeDebugSession?.customRequest(
                'breakpointLocations',
                args
            );
        return breakpointLocations;
    }
}
