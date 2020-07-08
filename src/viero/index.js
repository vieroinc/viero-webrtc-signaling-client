/**
 * Copyright 2020 Viero, Inc.
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

'use-strict'

import SocketIO from 'socket.io-client';
import { VieroWebRTCSignalingClient } from '../';
import { VieroError } from '@viero/common/error';
import { VieroLog } from '@viero/common/log';
import { VieroWebRTCSignalingCommon } from '@viero/webrtc-signaling-common';

const log = new VieroLog('/signaling/viero');

const _createNamespace = (url, name) => {
  return fetch(`${url}/signaling/namespace`, {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  }).then((res) => {
    if (201 === res.status) {
      return Promise.resolve();
    }
    return Promise.reject(new VieroError('/signaling/viero', 791221));
  });
}

export class VieroWebRTCSignalingClientImpl extends VieroWebRTCSignalingClient {

  constructor(url, channel) {
    super();
    if (!url) {
      throw new VieroError('/signaling/viero', 791222);
    }
    if (!channel) {
      throw new VieroError('/signaling/viero', 791223);
    }
    if (!/^([a-zA-Z0-9\-].*){4,}$/.test(channel)) {
      throw new VieroError('/signaling/viero', 791224);
    }
    this._url = url;
    this._channel = channel;
  }

  get connected() {
    return !!this._socket;
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this._socket) return resolve();
      _createNamespace(this._url, this._channel)
        .then(() => {
          this._socket = SocketIO(`${this._url}/${this._channel}`);
          [
            [VieroWebRTCSignalingCommon.SIGNAL.ENTER, 'dispatchEnter'],
            [VieroWebRTCSignalingCommon.SIGNAL.MESSAGE, 'dispatchMessage'],
            [VieroWebRTCSignalingCommon.SIGNAL.LEAVE, 'dispatchLeave'],
          ].forEach((def) => {
            this._socket.on(def[0], (message) => {
              if (!message) return;
              if (log.isDebug()) {
                log.debug(`SIG IN ${def[0]}`, message);
              }
              this[def[1]](message);
            });
          });
          resolve();
        }).catch((err) => reject(err));
    });
  }

  disconnect() {
    return new Promise((resolve) => {
      if (!this._socket) return resolve();
      this._socket.disconnect();
      this._socket = void 0;
      resolve();
    });
  }

  send(payload) {
    if (this._socket) {
      const message = { from: this._socket.id, payload };
      if (log.isDebug()) {
        log.debug(`SIG OUT ${VieroWebRTCSignalingCommon.SIGNAL.MESSAGE}`, message);
      }
      this._socket.emit(VieroWebRTCSignalingCommon.SIGNAL.MESSAGE, message);
    }
  }

}
