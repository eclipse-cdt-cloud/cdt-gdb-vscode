import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';

export class ResumeAllSession {
    constructor(context: ExtensionContext) {
        this.registerCommands(context);
    }

    private readonly registerCommands = (context: ExtensionContext) => {
        context.subscriptions.push(
            vscode.commands.registerCommand(
                'cdt.debug.resumeAllSession',
                async () => {
                    const session = vscode.debug.activeDebugSession;
                    if (session) {
                        await session.customRequest('continue', {
                            singleThread: false
                        });
                    }
                }
            )
        );
    };
}
