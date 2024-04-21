import { test } from '@japa/runner'
import { ReadableStream } from 'node:stream/web'
import { ReadableWebToNodeStream } from '../../src/stream_conversion.js'

const mockReadableStream = (
  data: string[] = [],
  shouldError: boolean = false,
  errorAfterEnqueues: number = -1
) =>
  new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      data.forEach((chunk, index) => {
        if (shouldError && index === errorAfterEnqueues) {
          controller.error(new Error('Stream error after enqueue'))
        } else {
          controller.enqueue(encoder.encode(chunk))
        }
      })

      if (!shouldError || errorAfterEnqueues === -1) {
        controller.close()
      }
    },
  })

test.group('ReadableWebToNodeStream Basic Functionality', () => {
  test('should correctly read data from a Web API stream', async ({ assert }, done) => {
    const mockStreamData = ['data1', 'data2']
    const mockStream = mockReadableStream(mockStreamData)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    const chunks: any[] = []
    for await (const chunk of nodeStream) {
      chunks.push(Uint8Array.from(chunk))
    }

    nodeStream.on('end', () => {
      const expectedData = mockStreamData.map((str) => Uint8Array.from(Buffer.from(str)))
      assert.deepEqual(chunks, expectedData)
      done()
    })
  })
  test('should end the stream after reading all data', async ({ assert }, done) => {
    const mockStream = mockReadableStream([])
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    nodeStream.on('end', () => {
      assert.isTrue(nodeStream.readableEnded)
      done()
    })
  })
})

test.group('ReadableWebToNodeStream Error Handling', () => {
  test('should emit an error event on stream error', async ({ assert }, done) => {
    const mockStream = mockReadableStream([], true)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    nodeStream.on('error', (error) => {
      assert.equal(error.message, 'Stream error')
      done()
    })
  })
})

test.group('ReadableWebToNodeStream State Management', () => {
  test('should close the stream correctly', async ({ assert }, done) => {
    const mockStream = mockReadableStream(['data'])
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    nodeStream.on('end', () => {
      assert.isTrue(nodeStream.readableEnded)
      done()
    })

    await nodeStream.close()
  })

  test('prevent multiple closures', async ({ assert }, done) => {
    const mockStream = mockReadableStream(['data'])
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    nodeStream.on('end', () => {
      assert.isTrue(nodeStream.readableEnded)
      done()
    })

    await nodeStream.close()
    await nodeStream.close() // calling close again
  })
})

test.group('ReadableWebToNodeStream Edge Cases', () => {
  test('handle empty stream', async ({ assert }, done) => {
    const mockStream = mockReadableStream([])
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    const chunks: any[] = []
    for await (const chunk of nodeStream) {
      chunks.push(chunk)
    }

    assert.isEmpty(chunks)
    done()
  }).waitForDone()

  test('handle large data stream', async ({ assert }, done) => {
    const largeData = new Array(10000).fill('data')
    const mockStream = mockReadableStream(largeData)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    const chunks: any[] = []
    nodeStream.on('data', (chunk) => {
      chunks.push(chunk)
    })

    nodeStream.on('end', () => {
      assert.lengthOf(chunks, 10000, 'Chunk count does not match expected length')
      assert.equal(chunks[0], 'data')
      done()
    })
  }).waitForDone()
})

test.group('ReadableWebToNodeStream Error Handling', () => {
  test('should handle error after partial read', async ({ assert }, done) => {
    const mockStream = mockReadableStream(['data1', 'data2'], true, 1)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    let errorCaught = false

    nodeStream.on('error', (error) => {
      if (!errorCaught) {
        errorCaught = true
        assert.equal(error.message, 'Stream error after enqueue')
        done()
      }
    })

    try {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      for await (const _chunk of nodeStream) {
      }
    } catch (error) {
      // Catch errors thrown during iteration over the stream
      if (!errorCaught) {
        errorCaught = true
        assert.fail('Error thrown during stream iteration')
        done()
      }
    }

    assert.isTrue(errorCaught)
  }).waitForDone()
})

test.group('ReadableWebToNodeStream Memory Leak Checks', () => {
  test('should handle large data stream with interruption', async ({ assert }, done) => {
    const largeData = new Array(10000).fill('data')
    const mockStream = mockReadableStream(largeData)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    let chunkCount = 0
    nodeStream.on('data', (_chunk) => {
      chunkCount++
      if (chunkCount === 5000) {
        nodeStream.destroy(new Error('Interruption error'))
      }
    })

    nodeStream.on('error', () => {
      assert.isAtLeast(chunkCount, 5000)
      assert.isAtMost(chunkCount, 10000) // Check that it didn't read past interruption
      done()
    })
  }).waitForDone()
})

test.group('ReadableWebToNodeStream State Management', () => {
  test('should handle multiple reads after closure', async ({ assert }, done) => {
    const mockStream = mockReadableStream(['data'])
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    await nodeStream.close()

    try {
      await nodeStream.read()
      await nodeStream.read() // Reading after closure
      done()
    } catch (error) {
      console.error(error)
      assert.fail('Should not throw error on multiple reads after closure')
    }
  }).waitForDone()
})

test.group('ReadableWebToNodeStream Error Handling', () => {
  test('should handle errors during stream closure', async ({ assert }, done) => {
    const mockStream = mockReadableStream(['data1', 'data2'], true, 1)
    const nodeStream = new ReadableWebToNodeStream(mockStream)

    nodeStream.on('error', (error) => {
      assert.equal(error.message, 'Stream error after enqueue')
      done()
    })

    await nodeStream.close()
  })
})
