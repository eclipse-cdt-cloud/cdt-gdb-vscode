import * as vscode from 'vscode';

const GDB_DEBUG_TYPES = ['gdb', 'gdbtarget'];
export class GdbDebugTracker {
    private valueFormatSupported : boolean;
    constructor() {
        this.valueFormatSupported = false;
        this.registerDebugTracker();
    }

    public registerDebugTracker() {
        for (const debugType of GDB_DEBUG_TYPES) {
            vscode.debug.registerDebugAdapterTrackerFactory(debugType, { createDebugAdapterTracker: () => this.createTracker() });
        }
    }

    private createTracker () : vscode.DebugAdapterTracker {
            return {
          // From vscode to debug adapter  
          onWillReceiveMessage: (message) => {
              // Check if the message is an evaluate request. If so, add property format to it
              if (message.command === 'evaluate' && message.type === 'request' && message.arguments.expression.trim().endsWith(',x') && this.valueFormatSupported) {
                  message.arguments.format = { 
                      // Add all the formats you want to support here
                      hex: true, 
                  };
                  message.arguments.expression = message.arguments.expression.trim().slice(0, -2); // Remove the ,x from the expression
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
