import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

export class CustomReset {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
        this.registerCallbacks();
    }

    private readonly registerCallbacks = () => {
        vscode.debug.onDidStartDebugSession((session) => {
            const hasCustomReset = Array.isArray(session.configuration?.customResetCommands) &&
                             session.configuration.customResetCommands.length > 0;
            vscode.commands.executeCommand('setContext', 'cdt.debug.hasCustomReset', hasCustomReset);
        });
        
        vscode.debug.onDidTerminateDebugSession(() => {
            vscode.commands.executeCommand('setContext', 'cdt.debug.hasCustomReset', false);
        });
    }

    private readonly registerCommands = (context: ExtensionContext) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'cdt.debug.customReset',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        await session.customRequest(
                            'cdt-gdb-adapter/customReset'
                        );
                    }
                }
            )
        );
    };
}
