import User from '#models/user'
import { DateTime } from 'luxon'

export interface TokenUserResponse {
  user: User
  token: AccessTokenResponse
}

export interface AccessTokenResponse {
  type: string
  token?: string
  lastUsedAt?: DateTime
  expiresAt?: DateTime
}
