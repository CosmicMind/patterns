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
  Plugin,
  PluginManager,
} from '@/index'

type Data = {
  prop: number
}

class PluginA extends Plugin<Data> {
  get name(): string {
    return 'Plugin A'
  }

  execute(data: Data): void {
    ++data.prop
  }
}

class PluginB extends Plugin<Data> {
  get name(): string {
    return 'Plugin B'
  }

  execute(data: Data): void {
    data.prop += 2
  }
}

describe('Plugin', () => {
  it('plugin execution', () => {
    const pm = new PluginManager<Data>()

    const a = new PluginA()
    const b = new PluginB()

    const data = {
      prop: 0,
    }

    expect(pm.register(a)).toBeTruthy()
    expect(pm.register(a)).toBeFalsy()

    expect(pm.register(b)).toBeTruthy()
    expect(pm.register(b)).toBeFalsy()

    expect(pm.deregister('bogus plugin')).toBeFalsy()

    pm.execute(data)

    expect(data.prop).toBe(3)
  })

  it('plugin removal', () => {
    const pm = new PluginManager<Data>()

    const a = new PluginA()
    const b = new PluginB()

    const data = {
      prop: 0,
    }

    expect(pm.register(a)).toBeTruthy()
    expect(pm.register(a)).toBeFalsy()

    expect(pm.register(b)).toBeTruthy()
    expect(pm.register(b)).toBeFalsy()

    expect(pm.deregister(a)).toBeTruthy()
    expect(pm.deregister(a.name)).toBeFalsy()

    pm.execute(data)

    expect(data.prop).toBe(2)

    expect(pm.deregister(b.name)).toBeTruthy()
    expect(pm.deregister(a)).toBeFalsy()
  })
})