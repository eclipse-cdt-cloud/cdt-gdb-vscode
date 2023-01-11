/* eslint-disable prettier/prettier */
import { ExtensionContext } from 'vscode';
import * as vscode from 'vscode';
import { LoggingDebugSession } from '@vscode/debugadapter';

export class ResumeAllSession extends LoggingDebugSession {
    constructor(context: ExtensionContext) {
        super();
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
