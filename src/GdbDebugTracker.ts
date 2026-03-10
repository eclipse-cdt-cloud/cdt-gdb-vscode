import * as vscode from 'vscode';

const GDB_DEBUG_TYPES = ['gdb', 'gdbtarget'];
export class GdbDebugTracker {
    private valueFormatSupported : boolean;
    private context : vscode.ExtensionContext;
    constructor(context: vscode.ExtensionContext) {
        this.valueFormatSupported = false;
        this.context = context;
        this.registerDefaultDebugTracker();
    }

    private registerDefaultDebugTracker() {
        const disposableList : vscode.Disposable[] = [];
        for (const debugType of GDB_DEBUG_TYPES) {
            const disposable = vscode.debug.registerDebugAdapterTrackerFactory(debugType, { createDebugAdapterTracker: () => this.createTracker() });
            disposableList.push(disposable);
        }
        this.context.subscriptions.push(...disposableList);
    }

    public registerDebugTracker(newDebugType : string) : vscode.Disposable {
        const disposable = vscode.debug.registerDebugAdapterTrackerFactory(newDebugType, { createDebugAdapterTracker: () => this.createTracker() });
        return disposable
    }

    private createTracker () : vscode.DebugAdapterTracker {
            return {
          // From vscode to debug adapter  
          onWillReceiveMessage: (message) => {
              // Check if the message is an evaluate request. If so, add property format to it
              if (message.command === 'evaluate' && message.type === 'request' && this.valueFormatSupported) {
                if (message.arguments.expression.trim().endsWith(',x')) {
                    message.arguments.format = { 
                      // Add all the formats you want to support here
                      hex: true, 
                    };
                    message.arguments.expression = message.arguments.expression.trim().slice(0, -2); // Remove the ,x from the expression
                } else {
                    message.arguments.format = { 
                      // Add all the formats you want to support here
                      hex: false, 
                    };
                }
              }
            },
          // From debug adapter to vscode
          onDidSendMessage: (message) => {
              if(message.command === 'initialize' && message.type === 'response' && message.body.supportsValueFormattingOptions) {
                  this.valueFormatSupported = true;
              }
          }
        }
    }
}
