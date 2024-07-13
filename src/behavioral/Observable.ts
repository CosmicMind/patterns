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
 * @module Observable
 */

import {
  timeout,
  guard,
} from '@cosmicmind/foundationjs'

export type ObservableTopics = {
  readonly [K: string]: unknown
}

export type ObservableTopicMap<T extends ObservableTopics> = {
  [K in keyof T]: Set<((message: T[K]) => void)>
}

export class Observable<T extends ObservableTopics> {
  protected readonly topics: Partial<ObservableTopicMap<T>>

  constructor() {
    this.topics = {}
  }

  subscribe<K extends keyof T>(topic: K, ...fn: ((message: T[K]) => void)[]): void {
    if (!this.topics[topic]) {
      this.topics[topic] = new Set()
    }
    const topics = this.topics[topic]
    if (guard(topics)) {
      for (const cb of fn) {
        topics?.add(cb)
      }
    }
  }

  once<K extends keyof T>(topic: K, ...fn: ((message: T[K]) => void)[]): void {
    const cb = (message: T[K]): void => {
      this.unsubscribe(topic, cb)
      for (const cb of fn) {
        cb(message)
      }
    }
    this.subscribe(topic, cb)
  }

  unsubscribe<K extends keyof T>(topic: K, ...fn: ((message: T[K]) => void)[]): void {
    if (this.topics[topic]) {
      const topics = this.topics[topic]
      if (guard(topics)) {
        for (const cb of fn) {
          topics?.delete(cb)
        }
      }
    }
  }

  protected publish<K extends keyof T>(topic: K, message: T[K]): () => void {
    return timeout((): void => {
      const topics = this.topics[topic] as Set<((message: T[K]) => void)>
      if (guard(topics)) {
        for (const fn of topics) {
          fn(message)
        }
      }
    })
  }

  protected publishSync<K extends keyof T>(topic: K, message: T[K]): void {
    const topics = this.topics[topic] as Set<((message: T[K]) => void)>
    if (guard(topics)) {
      for (const fn of topics) {
        fn(message)
      }
    }
  }
}
