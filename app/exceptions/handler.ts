import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import { Exception } from '@adonisjs/core/exceptions'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected debug = !app.inProduction

  // protected ignoreCodes = []
  // protected ignoreExceptions = []
  // protected ignoreStatuses = []

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: PossibleException, ctx: HttpContext) {
    const { message, status, code, stack, identifier } = error
    if (error.code === 'E_VALIDATION_ERROR') {
      return ctx.response.status(status).send({ code, status, errors: error.messages })
    }

    if (error instanceof Exception) {
      return ctx.response.status(status).send({
        message: ctx.i18n ? ctx.i18n.t(identifier || `500.E_UNKNOWN_ERROR`, {}, message) : message,
        code: code || 'E_UNKNOWN_ERROR',
        status: status || 500,
        stack: this.debug && stack,
      })
    }

    return ctx.response.status(500).send({
      message: message,
      code: 'E_UNKNOWN_ERROR',
      status: 500,
      stack: this.debug && stack,
    })

    // return super.handle(error, ctx)
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
export interface PossibleException extends Exception {
  messages: ValidationError
  identifier: string
}

export interface ValidationError {
  message: string
  rule: string
  field: string
}
