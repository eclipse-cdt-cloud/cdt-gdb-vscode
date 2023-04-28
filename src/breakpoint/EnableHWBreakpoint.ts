import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

export class EnableHWBreakpoint {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
    }

    private readonly registerCommands = (context: ExtensionContext) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'cdt.debug.enableHWBreakpoint',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        await vscode.commands.executeCommand(
                            'setContext',
                            'disableHardware',
                            true
                        );
                        await vscode.commands.executeCommand(
                            'setContext',
                            'enableHardware',
                            false
                        );
                        await session.customRequest(
                            'cdt-gdb-adapter/HWBreakpoint'
                        );
                    }
                }
            )
        );
    };
}
