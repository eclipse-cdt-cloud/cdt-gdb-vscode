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
    private highlightingEnabled: boolean = vscode.workspace
        .getConfiguration()
        .get<boolean>('cdt.debug.sourceHighlighting', true);
    private executableLineDecorator =
        vscode.window.createTextEditorDecorationType({
             backgroundColor: new vscode.ThemeColor(
                'editor.wordHighlightBackground'
            ),
            isWholeLine: true,
        });

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public activate(): void {
        this.registerToEvents();
        this.registerCommands();
        vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            true
        );
    }

    private registerToEvents(): void {
        const onDidChangeActiveDebugSessionDisposable =
            vscode.debug.onDidChangeActiveDebugSession(async (session) => {
                await this.handleOnDidChangeActiveDebugSession(session);
            });
        const onDidChangeActiveTextEditorDisposable =
            vscode.window.onDidChangeActiveTextEditor(async (editor) => {
                await this.handleOnDidChangeActiveTextEditor(editor);
            });
        const onDidChangeConfigurationDisposable =
            vscode.workspace.onDidChangeConfiguration(async (event) => {
                await this.handleOnDidChangeConfiguration(event);
            });

        this.context.subscriptions.push(
            onDidChangeActiveDebugSessionDisposable,
            onDidChangeActiveTextEditorDisposable,
            onDidChangeConfigurationDisposable
        );
    }

    private registerCommands(): void {
        const onEnableSourceFileHighlightingCommandDisposable =
            vscode.commands.registerCommand(
                'cdt.debug.enableSourceCodeHighlighting',
                async () => {
                    await this.handleEnableSourceFileHighlighting();
                }
            );
        const onDisableSourceFileHighlightingCommandDisposable =
            vscode.commands.registerCommand(
                'cdt.debug.disableSourceCodeHighlighting',
                async () => {
                    await this.handleDisableSourceFileHighlighting();
                }
            );
        this.context.subscriptions.push(
            onEnableSourceFileHighlightingCommandDisposable,
            onDisableSourceFileHighlightingCommandDisposable
        );
    }

    private async handleOnDidChangeConfiguration(
        event: vscode.ConfigurationChangeEvent
    ): Promise<void> {
        if (event.affectsConfiguration('cdt.debug.sourceHighlighting')) {
            this.highlightingEnabled = vscode.workspace
                .getConfiguration()
                .get<boolean>('cdt.debug.sourceHighlighting', true);
            if (!this.highlightingEnabled) {
                this.clearExecutableLineDecorations(
                    vscode.window.visibleTextEditors
                );
                vscode.commands.executeCommand(
                    'setContext',
                    'cdt.debug.sourceCodeHighlightingEnabled',
                    false
                );
            } else {
                await this.handleOnDidChangeActiveTextEditor(
                    vscode.window.activeTextEditor
                );
                vscode.commands.executeCommand(
                    'setContext',
                    'cdt.debug.sourceCodeHighlightingEnabled',
                    true
                );
            }
        }
    }

    private async handleEnableSourceFileHighlighting(): Promise<void> {
        if (!this.activeDebugSession) {
            return;
        }
        this.highlightingEnabled = true;
        await this.handleOnDidChangeActiveTextEditor(
            vscode.window.activeTextEditor
        );
        vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            true
        );
    }

    private async handleDisableSourceFileHighlighting(): Promise<void> {
        this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
        this.highlightingEnabled = false;
        vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            false
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
        if (!this.highlightingEnabled) {
            this.clearExecutableLineDecorations([editor]);
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

    private async handleOnDidChangeActiveDebugSession(
        session: vscode.DebugSession | undefined
    ): Promise<void> {
        if (!session) {
            this.clearExecutableLineDecorations(
                vscode.window.visibleTextEditors
            );
            vscode.commands.executeCommand(
                'setContext',
                'cdt.debug.sourceCodeHighlightingEnabled',
                false
            );
            this.highlightingEnabled = false;
            this.activeDebugSession = undefined;
            return;
        }
        if (session.type !== 'gdb' && session.type !== 'gdbtarget') {
            this.clearExecutableLineDecorations(
                vscode.window.visibleTextEditors
            );
            vscode.commands.executeCommand(
                'setContext',
                'cdt.debug.sourceCodeHighlightingEnabled',
                false
            );
            this.highlightingEnabled = false;
            this.activeDebugSession = undefined;
            return;
        }
        this.activeDebugSession = session;
        await this.handleOnDidChangeActiveTextEditor(
            vscode.window.activeTextEditor
        );
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
