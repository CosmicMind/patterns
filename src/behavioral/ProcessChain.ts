/**
 * BSD 3-Clause License
 *
 * Copyright © 2023, Daniel Jonathan <daniel at cosmicmind dot com>
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

/**
 * @module ProcessChain
 */

import {
  Nullable,
} from '@cosmicmind/foundationjs'

export type Chainable<T> = {
  /**
   * Retrieves the next value in the chain.
   *
   * @return {Nullable<Chainable<T>>} The next value in the chain, or null if there is none.
   */
  get next(): Nullable<Chainable<T>>

  /**
   * Executes the provided argument of type T.
   *
   * @param {T} arg - The argument to be executed.
   * @return {void} - This method does not return any value.
   */
  process(arg: T): void

  /**
   * Checks if the provided argument is processable.
   *
   * @param {T} arg - The argument to be checked for processability.
   * @return {boolean} - Returns `true` if the argument is processable, otherwise returns `false`.
   */
  isProcessable(arg: T): boolean
}

export abstract class ProcessChain<T> implements Chainable<T> {
  protected _next?: Nullable<Chainable<T>>

  /**
   * Retrieves the next item in the chain.
   *
   * @returns {Nullable<Chainable<T>>} The next item in the chain, or null if there isn't a next item.
   */
  get next(): Nullable<Chainable<T>> {
    return this._next || null
  }

  constructor() {
    this._next = null
  }

  /**
   * Appends a chainable object to the current object.
   *
   * @param {Chainable<T>} chainable - The chainable object to append.
   * @return {void} - This method does not return anything.
   */
  append(chainable: Chainable<T>): void {
    this._next = chainable
  }

  /**
   * Clears the next reference of the object.
   *
   * @returns {void}
   */
  clear(): void {
    this._next = null
  }

  /**
   * Executes the method with the given argument if the handle function returns false.
   * If the handle function returns true, the method is not executed and the next method in the chain is called recursively.
   *
   * @param {T} arg - The argument to be passed to the method.
   * @return {void}
   */
  process(arg: T): void {
    if (this.isProcessable(arg)) {
      this.execute(arg)
    }
    else {
      this.next?.process(arg)
    }
  }

  /**
   * Checks if the given argument can be processed.
   *
   * @param {T} arg - The argument to check if it is processable.
   * @return {boolean} - `true` if the argument is processable, otherwise `false`.
   */
  abstract isProcessable(arg: T): boolean

  /**
   * Executes the given argument.
   *
   * @param {T} arg - The argument to be executed.
   * @return {void}
   */
  protected abstract execute(arg: T): void
}
