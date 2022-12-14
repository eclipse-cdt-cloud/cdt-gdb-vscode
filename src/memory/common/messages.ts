/* eslint-disable @typescript-eslint/no-namespace */
/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { MemoryRequestArguments, MemoryContents } from 'cdt-gdb-adapter';
import { ChildDapContents } from 'cdt-amalgamator';

export namespace Message {
    export interface Request {
        token?: number;
    }

    export interface Response {
        token?: number;
        err?: string;
    }
}

export interface MemoryAmalgamatorRequestArguments
    extends MemoryRequestArguments {
    child?: number;
}

export namespace ReadMemory {
    export interface Request extends Message.Request {
        command: 'ReadMemory';
        args: MemoryAmalgamatorRequestArguments;
    }

    export interface Response extends Message.Response {
        command: 'ReadMemory';
        result?: MemoryContents;
    }
}

export namespace GetChildDapNames {
    export interface Request extends Message.Request {
        command: 'getChildDapNames';
    }

    export interface Response extends Message.Response {
        command: 'getChildDapNames';
        result?: ChildDapContents;
    }
}

export type ClientRequest = ReadMemory.Request;

export type ServerResponse = ReadMemory.Response;

export type ChildDapNamesClientRequest = GetChildDapNames.Request;

export type ChildDapNamesServerResponse = GetChildDapNames.Response;
