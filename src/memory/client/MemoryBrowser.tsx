/*********************************************************************
 * Copyright (c) 2019 QNX Software Systems and others
 *
 * This program and the accompanying materials are made
 * available under the terms of the Eclipse Public License 2.0
 * which is available at https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *********************************************************************/
import * as React from 'react';

export class MemoryBrowser extends React.Component {
    render() {
        return (
            <div style={{display: 'flex'}}>
                <div>One</div>
                <div style={{flexGrow: 1}}>Two</div>
                <div>Three</div>
                <div>Four</div>
            </div>
        );
    }
}
