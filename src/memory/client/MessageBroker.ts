/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import { ClientRequest, ServerResponse, ReadMemory } from '../common/messages';

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

class MessageBroker {
    private currentToken = 1;
    private queue: { [token: number]: (result: ServerResponse) => void } = {};

    constructor() {
        window.addEventListener('message', event => {
            const response: ServerResponse = event.data;
            if (response.token) {
                this.queue[response.token](response);
                delete this.queue[response.token];
            }
        });
    }

    send(request: ReadMemory.Request): Promise<ReadMemory.Response>;

    send<Req extends ClientRequest, Resp extends ServerResponse>(request: Req): Promise<Resp> {
        return new Promise<Resp>((resolve, reject) => {
            request.token = this.currentToken++;
            this.queue[request.token] = (result: ServerResponse) => result.err ? reject(result.err) : resolve(result as Resp);
            vscode.postMessage(request);
        });
    }
}

export const messageBroker = new MessageBroker();
