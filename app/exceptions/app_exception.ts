import { Exception } from '@adonisjs/core/exceptions'

import ERRORS from '../../resources/lang/en/errors.json'

export type ErrorCodes = keyof typeof ERRORS.custom

export default class AppException extends Exception {
  protected identifier: string
  constructor(code: ErrorCodes) {
    super()
    const [statusCode, errorCode] = code.split('.')
    this.code = errorCode
    this.status = +statusCode
    this.message = errorCode
    this.identifier = `errors.custom.${code}`
  }
}
