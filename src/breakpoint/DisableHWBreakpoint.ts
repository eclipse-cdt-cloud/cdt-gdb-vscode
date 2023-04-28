import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

export class DisableHWBreakpoint {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
    }

    private readonly registerCommands = (context: ExtensionContext) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'cdt.debug.disableHWBreakpoint',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        await vscode.commands.executeCommand(
                            'setContext',
                            'disableHardware',
                            false
                        );
                        await vscode.commands.executeCommand(
                            'setContext',
                            'enableHardware',
                            true
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
