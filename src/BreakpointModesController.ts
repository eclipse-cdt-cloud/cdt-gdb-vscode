/*********************************************************************
 * Copyright (c) 2026 Renesas Electronics Corporation and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import {
    ExtensionContext,
    Position,
    Location,
    SourceBreakpoint,
    commands,
    debug,
    window,
    Uri,
} from 'vscode';
import { arePathsEqual } from './utils';

export class BreakpointModesController {
    constructor(private context: ExtensionContext) {}

    setBreakpointHandler =
        (mode: 'hardware' | 'software') =>
        async (values: { uri: Uri; lineNumber: number }) => {
            try {
                const line = values.lineNumber - 1;
                const existingBreakpoints = debug.breakpoints.filter(
                    (bp: Partial<SourceBreakpoint>) =>
                        arePathsEqual(
                            bp?.location?.uri?.path,
                            values.uri.path,
                        ) && bp?.location?.range?.start?.line === line,
                );
                if (existingBreakpoints.length) {
                    const existingBreakpointHasDesiredMode =
                        existingBreakpoints.findIndex(
                            (bp: any) => bp.mode === mode,
                        ) > -1;
                    if (existingBreakpointHasDesiredMode) {
                        return;
                    }
                    debug.removeBreakpoints(existingBreakpoints);
                }
                const sp = new SourceBreakpoint(
                    new Location(values.uri, new Position(line, 0)),
                );
                // Limitation of VSCode: https://github.com/microsoft/vscode/issues/304764
                // This is a workaround to inject 'mode' into VS breakpoint object.
                // This injection functionally working as expected and passes the information
                // correctly through DAP messages, however the breakpoint mode information is not
                // visible in the breakpoint list window in VSCode
                (sp as any).mode = mode;
                debug.addBreakpoints([sp]);
            } catch (e) {
                window.showErrorMessage(
                    `Failed to set ${mode} breakpoint: ${e}`,
                );
            }
        };

    registerCommands = () => {
        this.context.subscriptions.push(
            commands.registerCommand(
                'cdt.debug.breakpoints.addHardwareBreakpoint',
                this.setBreakpointHandler('hardware'),
            ),
        );
        this.context.subscriptions.push(
            commands.registerCommand(
                'cdt.debug.breakpoints.addSoftwareBreakpoint',
                this.setBreakpointHandler('software'),
            ),
        );
    };
}
