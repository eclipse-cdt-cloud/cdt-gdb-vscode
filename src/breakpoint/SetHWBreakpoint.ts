import { ExtensionContext, window } from 'vscode';
import * as vscode from 'vscode';
import { BreakpointStatusBarItem } from './BreakpointStatusBarItem';
import * as path from 'path';

export class SetHWBreakpoint {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
    }

    private readonly registerCommands = (context: ExtensionContext) => {
        const breakpointStatusBarItem = new BreakpointStatusBarItem();
        context.subscriptions.push(breakpointStatusBarItem);
        vscode.debug.onDidChangeActiveDebugSession(async (debugSession) => {
            if (debugSession) {
                const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                if (!workspaceFolder) {
                    throw new Error('No workspace folder found.');
                }
                const configPath = path.join(
                    workspaceFolder.uri.fsPath,
                    '.vscode',
                    'launch.json'
                );
                const config: vscode.WorkspaceConfiguration =
                    vscode.workspace.getConfiguration(
                        'launch',
                        vscode.Uri.file(configPath)
                    );
                const HWBreakpointParameter: boolean | undefined =
                    config?.configurations[0]?.hardwareBreakpoint;
                if (HWBreakpointParameter === undefined) {
                    breakpointStatusBarItem.setText(
                        'Hardware breakpoint: False'
                    );
                } else {
                    breakpointStatusBarItem.setText(
                        `Hardware breakpoint: ${HWBreakpointParameter}`
                    );
                }
                breakpointStatusBarItem.show();
            } else {
                breakpointStatusBarItem.hide();
                breakpointStatusBarItem.setText('Hardware breakpoint: False');
            }
        });

        context.subscriptions.push(
            vscode.commands.registerCommand(
                'renesas.debug.setHWBreakpoint',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        const currentStatus = await session.customRequest(
                            'cdt-gdb-adapter/getHWBreakpoint'
                        );
                        const result = await session.customRequest(
                            'cdt-gdb-adapter/setHWBreakpoint',
                            { isSetHWBrekpoint: !currentStatus }
                        );
                        if (result) {
                            window.showInformationMessage(
                                'Hardware breakpoint is enabled'
                            );
                        } else {
                            window.showInformationMessage(
                                'Software breakpoint is enabled'
                            );
                        }
                        breakpointStatusBarItem.setText(
                            `Hardware breakpoint: ${result}`
                        );
                    }
                }
            )
        );
    };
}
