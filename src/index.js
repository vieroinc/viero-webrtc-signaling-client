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

import { VieroError } from '@viero/common/error';
import { VieroWebRTCSignalingCommon } from '@viero/webrtc-signaling-common';

export class VieroWebRTCSignalingClient extends EventTarget {

  send(payload) {
    throw new VieroError('/signaling', 458599, {
      [VieroError.KEY.MESSAGE]: 'VieroWebRTCSignalingClient().send(...) is not implemented!',
    });
  }

  dispatchEnter(detail) {
    this.dispatchEvent(new CustomEvent(VieroWebRTCSignalingCommon.SIGNAL.ENTER, { detail }));
  }

  dispatchMessage(detail) {
    this.dispatchEvent(new CustomEvent(VieroWebRTCSignalingCommon.SIGNAL.MESSAGE, { detail }));
  }

  dispatchLeave(detail) {
    this.dispatchEvent(new CustomEvent(VieroWebRTCSignalingCommon.SIGNAL.LEAVE, { detail }));
  }

}
