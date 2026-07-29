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
            light: { backgroundColor: '#d2e2e54d' },
            dark: { backgroundColor: 'rgba(255, 255, 255, 0.08)' },
            isWholeLine: true,
        });

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async activate(): Promise<void> {
        this.registerToEvents();
        this.registerCommands();
        await vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            this.highlightingEnabled
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
            } else {
                await this.handleOnDidChangeActiveTextEditor(
                    vscode.window.activeTextEditor
                );
            }
            await vscode.commands.executeCommand(
                'setContext',
                'cdt.debug.sourceCodeHighlightingEnabled',
                this.highlightingEnabled
            );
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
        await vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            true
        );
        await vscode.workspace
            .getConfiguration()
            .update(
                'cdt.debug.sourceHighlighting',
                true,
                vscode.ConfigurationTarget.Workspace
            );
    }

    private async handleDisableSourceFileHighlighting(): Promise<void> {
        this.clearExecutableLineDecorations(vscode.window.visibleTextEditors);
        this.highlightingEnabled = false;
        await vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            false
        );
        await vscode.workspace
            .getConfiguration()
            .update(
                'cdt.debug.sourceHighlighting',
                false,
                vscode.ConfigurationTarget.Workspace
            );
    }

    private async clearExecutableLineDecorations(
        editors: readonly vscode.TextEditor[]
    ): Promise<void> {
        for (const editor of editors) {
            editor.setDecorations(this.executableLineDecorator, []);
        }
        await vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            false
        );
    }

    private async handleOnDidChangeActiveTextEditor(
        editor: vscode.TextEditor | undefined
    ): Promise<void> {
        if (!editor) {
            return;
        }
        if (!this.highlightingEnabled || !this.activeDebugSession) {
            await this.clearExecutableLineDecorations([editor]);
            return;
        }
        const breakpointLocations = await this.getBreakpointLocations(editor);
        if (!breakpointLocations) {
            await this.clearExecutableLineDecorations([editor]);
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
            await this.handleSessionInActive();
            return;
        }
        if (session.type !== 'gdb' && session.type !== 'gdbtarget') {
            await this.handleSessionInActive();
            return;
        }
        this.activeDebugSession = session;
        vscode.commands.executeCommand(
            'setContext',
            'cdt.debug.sourceCodeHighlightingEnabled',
            this.highlightingEnabled
        );
        await this.handleOnDidChangeActiveTextEditor(
            vscode.window.activeTextEditor
        );
    }

    private async handleSessionInActive() {
        await this.clearExecutableLineDecorations(
            vscode.window.visibleTextEditors
        );
        return;
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
