import type { HttpContext } from '@adonisjs/core/http'
import type { CookieOptions } from '@adonisjs/core/types/http'

import { SessionData, SessionStoreContract } from '@adonisjs/session/types'
import debug from '../src/debug.js'

/**
 * Cookie store stores the session data inside an encrypted
 * cookie.
 */
export class CookieStore implements SessionStoreContract {
  #ctx: HttpContext
  #config: Partial<CookieOptions>

  constructor(config: Partial<CookieOptions>, ctx: HttpContext) {
    this.#config = config
    this.#ctx = ctx
    debug('initiating cookie store %O', this.#config)
  }

  /**
   * Read session value from the cookie
   */
  read(sessionId: string): SessionData | null {
    debug('cookie store: reading session data %s', sessionId)

    const cookieValue = this.#ctx.request.encryptedCookie(sessionId)
    if (typeof cookieValue !== 'object') {
      return null
    }

    return cookieValue
  }

  /**
   * Write session values to the cookie
   */
  write(sessionId: string, values: SessionData): void {
    debug('cookie store: writing session data %s: %O', sessionId, values)
    this.#ctx.response.encryptedCookie(sessionId, values, this.#config)
  }

  /**
   * Removes the session cookie
   */
  destroy(sessionId: string): void {
    debug('cookie store: destroying session data %s', sessionId)
    if (this.#ctx.request.cookiesList()[sessionId]) {
      this.#ctx.response.clearCookie(sessionId)
    }
  }

  /**
   * Updates the cookie with existing cookie values
   */
  touch(sessionId: string): void {
    const value = this.read(sessionId)
    debug('cookie store: touching session data %s', sessionId)
    if (!value) {
      return
    }

    this.write(sessionId, value)
  }
}
