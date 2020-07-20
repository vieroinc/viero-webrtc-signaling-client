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

import { shortUId } from '@viero/common/uid';
import { VieroLog } from '@viero/common/log';
import { VieroWebRTCSignalingCommon } from '@viero/webrtc-signaling-common';
import { VieroWindowUtils } from '@viero/common-web/window/utils';
import { VieroWebRTCSignalingClient } from '../';

const serverUrl = 'http://localhost:8090';

VieroLog.level = VieroLog.LEVEL.TRACE;

const urlObj = new URL(location.href);
const channel = urlObj.searchParams.get('channel');
if (!channel) {
  urlObj.searchParams.set('channel', shortUId());
  location.href = urlObj.toString();
}

const write = (envelope) => {
  const item = VieroWindowUtils.createElement('div', {
    classes: ['item'],
    container: document.body,
  });
  item.textContent = envelope;
};

const writeEvent = (type, payload) => write(`${type} - ${JSON.stringify(payload)}`);

const signaling = new VieroWebRTCSignalingClient(serverUrl, channel);

[
  VieroWebRTCSignalingCommon.SIGNAL.ENTER,
  VieroWebRTCSignalingCommon.SIGNAL.MESSAGE,
  VieroWebRTCSignalingCommon.SIGNAL.LEAVE,
].forEach((type) => signaling.addEventListener(type, (evt) => writeEvent(type, evt.detail)));

signaling.connect().then(() => {
  write("CONNECTED");
  setInterval(() => {
    signaling.send({ time: new Date() });
  }, 2000);
}).catch((err) => alert(`Can't connect: ${err.message}`));
