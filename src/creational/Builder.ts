/**
 * BSD 3-Clause License
 *
 * Copyright © 2025, CosmicMind, Inc.
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
 * @module Builder
 */

/**
 * A `Buildable` structure is capable of constructing an instance
 * in multiple steps.
 */
export type Buildable<T> = {
  /**
   * Creates a concrete instance of type `T`.
   */
  build(): Readonly<T>
}

/**
 * A `Builder`
 */
export class Builder<T, K extends keyof T = keyof T> implements Buildable<T> {
    #props: T

    constructor(props: T) {
        this.#props = props
    }

    set<P extends K, V extends T[P]>(prop: P, value: V): this {
        Object.defineProperty(this.#props, prop, {
            configurable: true,
            enumerable: true,
            writable: false,
            value,
        })
        return this
    }

    map<P extends K, V extends T[P]>(props: Partial<Pick<T, K>>): this {
        for (const [ key, value ] of Object.entries(props)) {
            this.set(key as P, value as V)
        }
        return this
    }

    build(): Readonly<T> {
        const instance = this.#props
        this.#clear()
        return instance as T
    }

    #clear(): void {
        this.#props = {} as T
    }
}