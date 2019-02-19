/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { MemoryRequestArguments, MemoryResponse } from 'cdt-gdb-adapter';

export namespace Message {
    export interface Request {
        token?: number;
    }
    
    export interface Response {
        token?: number;
        err?: string;
    }
}

export namespace ReadMemory {
    export interface Request extends Message.Request {
        command: 'ReadMemory';
        args: MemoryRequestArguments;
    }

    export interface Response extends Message.Response {
        command: 'ReadMemory';
        result?: MemoryResponse;
    }
}

export type ClientRequest =
    ReadMemory.Request
;

export type ServerResponse =
    ReadMemory.Response
;