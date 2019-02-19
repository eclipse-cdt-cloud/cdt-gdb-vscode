/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/

/*********************************************************************
 * Based on the theia-cpp-extension in Eclipse Theia under EPL-2.0
 *********************************************************************/

import * as React from 'react';
import { MemoryResponse } from 'cdt-gdb-adapter';

import './MemoryBrowser.scss';
import { messageBroker } from './MessageBroker';

class ForwardIterator implements Iterator<number> {
    private nextItem: number = 0;

    constructor(private array: Uint8Array) { }

    next(): IteratorResult<number> {
        if (this.nextItem < this.array.length) {
            return {
                value: this.array[this.nextItem++],
                done: false,
            }
        } else {
            return {
                done: true,
                value: 0,
            };
        }
    }

    [Symbol.iterator](): IterableIterator<number> {
        return this;
    }
}

class ReverseIterator implements Iterator<number> {
    private nextItem: number;

    constructor(private array: Uint8Array) {
        this.nextItem = this.array.length - 1;
    }

    next(): IteratorResult<number> {
        if (this.nextItem >= 0) {
            return {
                value: this.array[this.nextItem--],
                done: false,
            }
        } else {
            return {
                done: true,
                value: 0,
            };
        }
    }

    [Symbol.iterator](): IterableIterator<number> {
        return this;
    }
}

interface Props {
};

interface State {
    memory?: MemoryResponse;
    error?: JSX.Element;
    bytesPerRow: number;
    bytesPerGroup: number;
    endianness: 'le' | 'be';
};

export class MemoryBrowser extends React.Component<Props, State> {
    private addressReq = "";
    private lengthReq = "512";

    constructor (props: Props) {
        super(props);
        this.state = {
            bytesPerRow: 32,
            bytesPerGroup: 8,
            endianness: 'le'
        };
    }

    async sendReadMemoryRequest() {
        if (!this.addressReq) {
            this.setState({error: <h3>No address</h3>});
        } else {
            try {
                this.setState({
                    error: undefined,
                    memory: undefined
                });
                const result = await messageBroker.send({
                    command: 'ReadMemory',
                    args: {
                        address: this.addressReq,
                        length: parseInt(this.lengthReq)
                    }
                });
                this.setState({memory: result.result});
            } catch (err) {
                this.setState({error: <h3>{err}</h3>});
            }
        }
    }

    onEndiannessChange(event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if (value === 'le' || value === "be") {
            this.setState({endianness: value});
        }
    }

    renderInputSection() {
        return (
            <div className="group">
                <div className="input-group">
                    <label>Location</label>
                    <input
                        type="text"
                        size={30}
                        title="Memory Location to display, an address or expression evaluating to an address"
                        placeholder="location..."
                        onChange={event => this.addressReq = event.target.value}
                    />
                </div>
                <div className="input-group">
                    <label>Length</label>
                    <input
                        type="text"
                        size={6}
                        title="Number of bytes to fetch, in decimal or hexadecimal"
                        defaultValue={this.lengthReq}
                        onChange={event => this.addressReq = event.target.value}
                    />
                </div>
                <div className="input-group">
                    <button
                        onClick={() => this.sendReadMemoryRequest()}
                        
                    >
                        Go
                    </button>
                </div>
                <div style={{width: "30px"}}></div>
                <div className="input-group">
                    <label>Bytes Per Row</label>
                    <select defaultValue="32"
                        onChange={event => this.setState({bytesPerRow: parseInt(event.target.value)})}
                    >
                        <option value='16'>16</option>
                        <option value='32'>32</option>
                        <option value='64'>64</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>Bytes Per Group</label>
                    <select defaultValue="8"
                        onChange={event => this.setState({bytesPerGroup: parseInt(event.target.value)})}
                    >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='4'>4</option>
                        <option value='8'>8</option>
                        <option value='16'>16</option>
                    </select>
                </div>
                <div className="input-group">
                    <label>
                        <input
                            type="radio"
                            value="le"
                            name="endianness"
                            defaultChecked={true}
                            onChange={event => this.onEndiannessChange(event)}
                        />
                        Little Endian
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="be"
                            name="endianness"
                            defaultChecked={false}
                            onChange={event => this.onEndiannessChange(event)}
                        />
                        Big Endian
                    </label>
                </div>
            </div>
        );
    }

    private hex2bytes(hex: string): Uint8Array {
        const bytes = new Uint8Array(hex.length / 2);

        for (let i = 0; i < hex.length / 2; i++) {
            const hexByte = hex.slice(i * 2, (i + 1) * 2);
            const byte = parseInt(hexByte, 16);
            bytes[i] = byte;
        }

        return bytes;
    }

    private isprint(byte: number) {
        return byte >= 32 && byte < 127;
    }
    
    private renderRows() {
        if (!this.state.memory) {
            return undefined;
        }

        const bytes = this.hex2bytes(this.state.memory.data);
        const address = parseInt(this.state.memory.address, 16);

        const rows: JSX.Element[] = [];

        for (let rowOffset = 0; rowOffset < bytes.length; rowOffset += this.state.bytesPerRow) {
            const rowBytes = bytes.subarray(rowOffset, rowOffset + this.state.bytesPerRow);

            const addressStr = '0x' + (address + rowOffset).toString(16);
            const data: string[] = [];
            let asciiStr = '';

            for (let groupOffset = 0; groupOffset < rowBytes.length; groupOffset += this.state.bytesPerGroup) {
                const groupBytes = rowBytes.subarray(groupOffset, groupOffset + this.state.bytesPerGroup);
                let groupStr = '';
                const iteratorType = this.state.endianness == 'be' ? ForwardIterator : ReverseIterator;

                for (const byte of new iteratorType(groupBytes)) {
                    const byteStr = byte.toString(16);
                    if (byteStr.length == 1) {
                        groupStr += '0';
                    }
                    groupStr += byteStr;
                }

                data.push(groupStr);

                for (const byte of groupBytes) {
                    asciiStr += this.isprint(byte) ? String.fromCharCode(byte) : '.';
                }
            }

            rows.push(
                <tr key={rowOffset}>
                    <td key={`addr${rowOffset}`}>{addressStr}</td>
                    {data.map((group, index) => <td key={`data${rowOffset},${index}`}>{group}</td>)}
                    <td key={`asc${rowOffset}`}>{asciiStr}</td>
                </tr>
            )
        }

        return (
            <React.Fragment>
                {rows}
            </React.Fragment>
        );
    }

    private renderMemory() {
        if (!this.state.memory) {
            return undefined;
        }

        return (
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Address</th>
                            <th colSpan={this.state.bytesPerRow / this.state.bytesPerGroup}>Data</th>
                            <th>ASCII</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div id="memory-browser">
                {this.renderInputSection()}
                <hr className="seperator" />
                {this.state.error}
                {this.renderMemory()}
            </div>
        );
    }
}
