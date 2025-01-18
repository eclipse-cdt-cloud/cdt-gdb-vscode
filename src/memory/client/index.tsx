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
import * as ReactDOMClient from 'react-dom/client';
import { MemoryBrowser } from './MemoryBrowser';

const container = document.getElementById('app') as ReactDOMClient.Container;
ReactDOMClient.createRoot(container).render(<MemoryBrowser />);
