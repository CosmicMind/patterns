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
  Command,
  CommandHistory,
} from '@/index'

class LightReceiver {
  protected _isOn = false

  get isOn(): boolean {
    return this._isOn
  }

  turnOn(): void {
    this._isOn = true
  }

  turnOff(): void {
    this._isOn = false
  }
}

class TurnOnLightCommand implements Command {
  protected light: LightReceiver

  constructor(light: LightReceiver) {
    this.light = light
  }

  execute(): boolean {
    this.light.turnOn()
    return true
  }
}

class TurnOffLightCommand implements Command {
  protected light: LightReceiver

  constructor(light: LightReceiver) {
    this.light = light
  }

  execute(): boolean {
    this.light.turnOff()
    return true
  }
}

describe('Command', () => {
  it('Command execution', () => {
    const commandHistory = new CommandHistory()
    const light = new LightReceiver()

    const cmd1 = new TurnOnLightCommand(light)
    expect(cmd1.execute()).toBeTruthy()
    expect(light.isOn).toBeTruthy()
    commandHistory.push(cmd1)


    const cmd2 = new TurnOffLightCommand(light)
    expect(cmd2.execute()).toBeTruthy()
    expect(light.isOn).toBeFalsy()
    commandHistory.push(cmd2)

    expect(commandHistory.pop()).instanceof(TurnOffLightCommand)
    expect(commandHistory.pop()).instanceof(TurnOnLightCommand)
    expect(commandHistory.pop()).toBeUndefined()
  })
})