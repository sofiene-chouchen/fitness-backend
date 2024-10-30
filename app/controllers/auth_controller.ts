import User from '#models/user'
import { loginValidator, registerValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import { SuccessResponse } from '../interfaces/success_response.js'
import { AccessTokenResponse } from '../interfaces/token_user_response.js'
import { DateTime } from 'luxon'

/**
 * @tag auth
 */
export default class AuthController {
  /**
   * @register
   * @description Register
   * @requestBody <registerValidator>
   * @responseBody 200 - <AccessTokenResponse>
   */
  async register({ request }: HttpContext): Promise<AccessTokenResponse> {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create(data)
    const token = await User.accessTokens.create(user)

    return {
      type: token.type,
      token: token.value?.release(),
      expiresAt: token.expiresAt ? DateTime.fromJSDate(token.expiresAt) : undefined,
      lastUsedAt: token.lastUsedAt ? DateTime.fromJSDate(token.lastUsedAt) : undefined,
    }
  }

  /**
   * @login
   * @description Login
   * @requestBody <loginValidator>
   * @responseBody 200 - <AccessTokenResponse>
   */
  async login({ request }: HttpContext): Promise<AccessTokenResponse> {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return {
      type: token.type,
      token: token.value?.release(),
      expiresAt: token.expiresAt ? DateTime.fromJSDate(token.expiresAt) : undefined,
      lastUsedAt: token.lastUsedAt ? DateTime.fromJSDate(token.lastUsedAt) : undefined,
    }
  }

  /**
   * @logout
   * @description Logout
   * @responseBody 200 - <SuccessResponse>
   */
  async logout({ auth }: HttpContext): Promise<SuccessResponse> {
    const user = auth.user!
    await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    return { success: true }
  }

  /**
   * @me
   * @description Get current user profile
   * @responseBody 200 - <User>
   */
  async me({ auth }: HttpContext): Promise<User | undefined> {
    await auth.check()

    return auth.user
  }
}
