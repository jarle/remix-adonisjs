import { Readable } from 'node:stream'
import { ReadableStream, ReadableStreamDefaultReader } from 'node:stream/web'

/**
 * Converts a Web-API stream into Node stream.Readable class
 * Node stream readable: https://nodejs.org/api/stream.html#stream_readable_streams
 * Web API readable-stream: https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
 * Node readable stream: https://nodejs.org/api/stream.html#stream_readable_streams
 */
export class ReadableWebToNodeStream extends Readable {
  bytesRead = 0
  released = false

  private reader: ReadableStreamDefaultReader<any>
  private pendingRead?: Promise<any>

  constructor(stream: ReadableStream) {
    super()
    this.reader = stream.getReader()
  }

  async _read() {
    if (this.released || this.readableEnded) {
      this.push(null)
      return
    }

    try {
      this.pendingRead = this.reader.read()
      const data = await this.pendingRead

      if (data.done || this.released) {
        this.push(null)
      } else {
        this.bytesRead += data.value.length
        this.push(data.value)
      }
    } catch (error) {
      this.emit('error', error)
    } finally {
      delete this.pendingRead
    }
  }

  async waitForReadToComplete() {
    if (this.pendingRead) {
      await this.pendingRead
    }
  }

  async close() {
    if (!this.released) {
      this.released = true
      await this.syncAndRelease()
    }
  }

  private async syncAndRelease() {
    await this.waitForReadToComplete()
    this.reader.releaseLock()
  }
}
