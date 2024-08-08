/**
 * BSD 3-Clause License
 *
 * Copyright © 2024, Daniel Jonathan <daniel at cosmicmind dot com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES LOSS OF USE, DATA, OR PROFITS OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import {
  it,
  expect,
  describe,
} from 'vitest'

import {
  RequestChain,
} from '@/index'

type Data = {
  prop: number
}

class ProcessableChain extends RequestChain<Data> {
  isProcessable(data: Data): boolean {
    return 'prop' in data
  }

  protected processor(data: Data): void {
    ++data.prop
  }
}

class UnprocessableChain extends RequestChain<Data> {
  isProcessable(data: Data): boolean {
    return !('prop' in data)
  }

  protected processor(data: Data): void {
    ++data.prop
  }
}

describe('RequestChain', () => {
  it('count the links in the chain', () => {
    const a = new ProcessableChain()
    const b = new ProcessableChain()

    const data = {
      prop: 0,
    }

    expect(a.isProcessable(data)).toBeTruthy()
    expect(b.isProcessable(data)).toBeTruthy()

    a.append(b)
    a.execute(data)

    expect(data.prop).toBe(1)
  })

  it('break the links in the chain', () => {
    const a = new UnprocessableChain()
    const b = new ProcessableChain()
    const c = new ProcessableChain()

    const data = {
      prop: 0,
    }

    expect(a.isProcessable(data)).toBeFalsy()
    expect(b.isProcessable(data)).toBeTruthy()
    expect(c.isProcessable(data)).toBeTruthy()

    a.append(b)
    b.append(c)
    a.execute(data)

    expect(data.prop).toBe(1)
  })
})