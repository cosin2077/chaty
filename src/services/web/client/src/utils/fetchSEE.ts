import { createParser } from 'eventsource-parser'

import * as types from './types'
import globalFetch from 'node-fetch'

export async function* streamAsyncIterable<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader()
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        return
      }
      yield value
    }
  } finally {
    reader.releaseLock()
  }
}


export async function fetchSSE(
  url: string,
  options: Parameters<typeof fetch>[1] & { onMessage: (data: string) => void },
  fetch: types.FetchFn = (globalFetch as types.FetchFn)
) {
  const { onMessage, ...fetchOptions } = options
  const res = await fetch(url, fetchOptions)
  if (!res.ok) {
    let reason: string

    try {
      reason = await res.text()
    } catch (err) {
      reason = res.statusText
    }

    const msg = `ChatGPT error ${res.status}: ${reason}`
    const error = new types.ChatGPTError(msg, { cause: res })
    error.statusCode = res.status
    error.statusText = res.statusText
    throw error
  }

  const parser = createParser((event) => {
    if (event.type === 'event') {
      onMessage(event.data)
    }
  })

  if (!res.body?.getReader) {
    // Vercel polyfills `fetch` with `node-fetch`, which doesn't conform to
    // web standards, so this is a workaround...
    const body: NodeJS.ReadableStream = res.body as any

    if (!body.on || !body.read) {
      throw new types.ChatGPTError('unsupported "fetch" implementation')
    }

    body.on('readable', () => {
      let chunk: string | Buffer
      while (null !== (chunk = body.read())) {
        parser.feed(chunk.toString())
      }
    })
  } else {
    for await (const chunk of streamAsyncIterable(res.body)) {
      const str = new TextDecoder().decode(chunk)
      parser.feed(str)
    }
  }
}