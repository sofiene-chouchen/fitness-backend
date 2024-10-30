import type { HttpContext } from '@adonisjs/core/http'

/**
 * @tag public
 */
export default class AppController {
  /**
   * @health
   * @description Check app health
   */
  async health({}: HttpContext) {
    return
  }
}
