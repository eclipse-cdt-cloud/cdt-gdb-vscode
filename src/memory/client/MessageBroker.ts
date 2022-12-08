/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import {
    ClientRequest,
    ServerResponse,
    ReadMemory,
    ChildDapNamesServerResponse,
    GetChildDapNames,
} from '../common/messages';

declare function acquireVsCodeApi(): any;
const vscode = acquireVsCodeApi();

class MessageBroker {
    private currentToken = 1;
    private queue1: { [token: number]: (result: ServerResponse) => void } = {};
    private queue2: {
        [token: number]: (result: ChildDapNamesServerResponse) => void;
    } = {};

    constructor() {
        window.addEventListener('message', (event) => {
            const response1: ServerResponse = event.data;
            if (response1.token) {
                this.queue1[response1.token](response1);
                delete this.queue1[response1.token];
            }
        });
        window.addEventListener('message', (event) => {
            const response2: ChildDapNamesServerResponse = event.data;
            if (response2.token) {
                this.queue2[response2.token](response2);
                delete this.queue2[response2.token];
            }
        });
    }

    send(request: ReadMemory.Request): Promise<ReadMemory.Response>;

    send<Req extends ClientRequest, Resp extends ServerResponse>(
        request: Req
    ): Promise<Resp> {
        return new Promise<Resp>((resolve, reject) => {
            request.token = this.currentToken++;
            this.queue1[request.token] = (result: ServerResponse) =>
                result.err ? reject(result.err) : resolve(result as Resp);
            vscode.postMessage(request);
        });
    }

    sendGetChildrenNames(
        request: GetChildDapNames.Request
    ): Promise<GetChildDapNames.Response>;

    sendGetChildrenNames<
        Req extends ClientRequest,
        Resp extends ChildDapNamesServerResponse
    >(request: Req): Promise<Resp> {
        return new Promise<Resp>((resolve, reject) => {
            request.token = this.currentToken++;
            this.queue2[request.token] = (
                result: ChildDapNamesServerResponse
            ) => (result.err ? reject(result.err) : resolve(result as Resp));
            vscode.postMessage(request);
        });
    }
}

export const messageBroker = new MessageBroker();
