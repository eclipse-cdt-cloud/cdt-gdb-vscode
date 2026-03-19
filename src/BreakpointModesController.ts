/*********************************************************************
 * Copyright (c) 2026 Renesas Electronics Corporation and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { platform } from 'node:os';
import { normalize } from 'node:path';
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

/**
 * This function compares the given paths, returns true if they are equal.
 *
 * - The compare function normalises the paths before checking, which means '.' and '..' expressions
 *   reduced properly.
 * - For Windows, the compare function is case insensitive
 * - For Windows, the compare function also handles backslashes, forward slashes insensitively.
 * - Compare function handles undefined values, which means given paths can be undefined. No need to check
 *   undefined before sending the arguments.
 *
 * @param path1
 *      First path to compare
 * @param path2
 *      Second path to compare
 */
export const arePathsEqual = (
    path1: string | undefined,
    path2: string | undefined,
): boolean => {
    if (!path1 || !path2) {
        return path1 === path2;
    }
    const nPath1 = normalize(path1);
    const nPath2 = normalize(path2);
    return platform() === 'win32'
        ? nPath1.localeCompare(nPath2, undefined, { sensitivity: 'accent' }) ===
              0
        : nPath1 === nPath2;
};

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
                // Limitation of VSCode:
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
