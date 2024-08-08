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

import { Prototype } from '@/index'

class A extends Prototype {
  private readonly _name: string
  readonly count: number
  readonly location: string

  get name(): string {
    return this._name
  }

  constructor(name: string, count: number, location: string) {
    super()
    this._name = name
    this.count = count
    this.location = location
  }

  subtractCount(count: number): number {
    return this._subtractCount(count)
  }

  private _subtractCount(count: number): number {
    return this.count - count
  }
}

describe('Prototype', () => {
  it('Prototype: equal properties and functions', () =>  {
    const name = 'daniel'
    const count = 38
    const location = 'CR'
    const a = new A(name, count, location)
    const b = a.clone()
    expect(a.name).toBe(name)
    expect(a.count).toBe(count)
    expect(a.location).toBe(location)
    expect(b.name).toBe(a.name)
    expect(b.count).toBe(a.count)
    expect(b.location).toBe(a.location)
    expect(b.subtractCount(3)).toBe(a.subtractCount(3))
  })

  it('Prototype: instances refs not equal', () =>  {
    const name = 'daniel'
    const count = 38
    const location = 'CR'
    const a = new A(name, count, location)
    const b = a.clone()
    expect(a).not.toBe(b)
  })

  it('Prototype: clone equal to clone', () =>  {
    const name = 'daniel'
    const count = 38
    const location = 'CR'
    const a = new A(name, count, location)
    const b = a.clone()
    const c = b.clone()
    expect(b.name).toBe(name)
    expect(b.count).toBe(count)
    expect(b.location).toBe(location)
    expect(c.name).toBe(b.name)
    expect(c.count).toBe(b.count)
    expect(c.location).toBe(b.location)
    expect(c.subtractCount(5)).toBe(b.subtractCount(5))
  })

  it('Prototype: correct instanceof detection', () =>  {
    const name = 'daniel'
    const count = 38
    const location = 'CR'
    const a = new A(name, count, location)
    const b = a.clone()
    const c = b.clone()
    expect(a instanceof A).toBeTruthy()
    expect(b instanceof A).toBeTruthy()
    expect(c instanceof A).toBeTruthy()
  })
})
