/**
 * Copyright 2026 Arm Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as vscode from 'vscode';
import { DebugProtocol } from '@vscode/debugprotocol';

export class SourceFileHighlighting {
    private activeDebugSession: vscode.DebugSession | undefined;
    private context: vscode.ExtensionContext;
    private executableLineDecorator = vscode.window.createTextEditorDecorationType({
        borderWidth: '0 0 0 2px',
        borderStyle: 'solid',
        borderColor: 'rgba(102, 145, 255, 0.85)',
        isWholeLine: true
    });

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public activate(): void {
        this.registerToEvents();
    }

    private registerToEvents(): void {
        const onDidChangeActiveDebugSessionDisposable = vscode.debug.onDidChangeActiveDebugSession(session => {
            if (!session) {
                this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
            }
            this.activeDebugSession = session;
            this.handleOnDidChangeActiveTextEditor(vscode.window.activeTextEditor);
        });
        const onDidChangeActiveTextEditorDisposable = vscode.window.onDidChangeActiveTextEditor(editor => {
            this.handleOnDidChangeActiveTextEditor(vscode.window.activeTextEditor);
        });

        this.context.subscriptions.push(onDidChangeActiveDebugSessionDisposable, onDidChangeActiveTextEditorDisposable);
    }

    private clearExecutableLineDecorations(editors: readonly vscode.TextEditor[]): void {
        for (const editor of editors) {
            editor.setDecorations(this.executableLineDecorator, []);
        }
    }

    private async handleOnDidChangeActiveTextEditor(editor: vscode.TextEditor | undefined): Promise<void> {
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
        const executableLines = new Set(breakpointLocations.breakpoints.map((bp: DebugProtocol.BreakpointLocation) => bp.line));
        const decorations: vscode.DecorationOptions[] = Array.from(executableLines).map((exeline: number) => {
            const line = exeline - 1; // Convert to 0-based index
            return {
                range: new vscode.Range(line, 0, line, 0),
            };
        });
        editor.setDecorations(this.executableLineDecorator, decorations);
    }

    private async getBreakpointLocations(editor: vscode.TextEditor): Promise<DebugProtocol.BreakpointLocationsResponse['body'] | void> {
        if (editor.document.uri.scheme !== 'file') {
            return;
        }
        const currentSourceFile = editor.document.fileName;
        const args: DebugProtocol.BreakpointLocationsArguments = {
            source: { path: currentSourceFile },
            line: 1,
            endLine: editor.document.lineCount, // Requesting breakpoint locations for the whole file
        };
        const breakpointLocations = await this.activeDebugSession?.customRequest('breakpointLocations', args);
        return breakpointLocations;
    }
}
