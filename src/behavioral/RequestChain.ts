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
 * @module RequestChain
 */

import {
  Optional,
} from '@cosmicmind/foundationjs'

export type Chainable<T> = {
  /**
   * Retrieves the next value in the chain.
   *
   * @return {Optional<Chainable<T>>} The next value in the chain, or undefined if there is none.
   */
  get next(): Optional<Chainable<T>>

  /**
   * Executes the method with the given arguments.
   *
   * @param {...T} args - The arguments to be passed to the method.
   * @return {void}
   */
  execute(...args: T[]): void

  /**
   * Checks if the given arguments can be processed.
   *
   * @param {...T} args - The arguments to be checked.
   * @return {void}
   */
  isProcessable(...args: T[]): void
}

export abstract class RequestChain<T> implements Chainable<T> {
  protected _next: Optional<Chainable<T>>

  /**
   * Retrieves the next item in the chain.
   *
   * @returns {Optional<Chainable<T>>} The next item in the chain, or undefined if there isn't a next item.
   */
  get next(): Optional<Chainable<T>> {
    return this._next
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
    this._next = undefined
  }

  /**
   * Executes the processor if the given arguments are executable,
   * otherwise passes the arguments to the next execute method in the chain.
   *
   * @template T - Type of the arguments.
   *
   * @param {...T[]} args - The arguments to be passed to the processor.
   *
   * @returns {void}
   */
  execute(...args: T[]): void {
    if (this.isProcessable(...args)) {
      this.processor(...args)
    }
    else {
      this.next?.execute(...args)
    }
  }

  /**
   * Determines if the given arguments are processable.
   *
   * @param {...T} args - The arguments to be checked for processability.
   * @return {boolean} - True if the arguments are processable, false otherwise.
   */
  abstract isProcessable(...args: T[]): boolean

  /**
   * Process the given arguments of type T.
   *
   * @param {...T} args - The arguments to be processed.
   * @return {void}
   */
  protected abstract processor(...args: T[]): void
}
