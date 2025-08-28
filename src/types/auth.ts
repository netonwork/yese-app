import * as v from 'valibot'
import { ID, Timestamp, Email } from './common'

// 用户基础信息
export const User = v.object({
  id: ID,
  username: v.string([v.minLength(3), v.maxLength(20)]),
  email: Email,
  avatar: v.optional(v.string()),
  isVip: v.boolean(),
  vipLevel: v.optional(v.number([v.minValue(1), v.maxValue(10)])),
  vipExpiresAt: v.optional(Timestamp),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  lastLoginAt: v.optional(Timestamp),
  // 用户统计
  stats: v.optional(v.object({
    totalWatchTime: v.number(), // 总观看时长(分钟)
    favoriteCount: v.number(),  // 收藏数量
    historyCount: v.number()    // 历史记录数量
  }))
})

// 登录请求
export const LoginRequest = v.object({
  username: v.string([v.minLength(1)]),
  password: v.string([v.minLength(6)])
})

// 注册请求
export const RegisterRequest = v.object({
  username: v.string([v.minLength(3), v.maxLength(20)]),
  email: Email,
  password: v.string([v.minLength(6), v.maxLength(50)]),
  confirmPassword: v.string()
})

// 认证响应
export const AuthResponse = v.object({
  user: User,
  accessToken: v.string(),
  refreshToken: v.string(),
  expiresIn: v.number() // token过期时间(秒)
})

// Token刷新请求
export const RefreshTokenRequest = v.object({
  refreshToken: v.string()
})

// Token刷新响应
export const RefreshTokenResponse = v.object({
  accessToken: v.string(),
  refreshToken: v.string(),
  expiresIn: v.number()
})

// 更新用户资料请求
export const UpdateProfileRequest = v.object({
  username: v.optional(v.string([v.minLength(3), v.maxLength(20)])),
  email: v.optional(Email),
  avatar: v.optional(v.string()),
  currentPassword: v.optional(v.string()),
  newPassword: v.optional(v.string([v.minLength(6)]))
})

// 导出类型
export type User = v.InferOutput<typeof User>
export type LoginRequest = v.InferOutput<typeof LoginRequest>
export type RegisterRequest = v.InferOutput<typeof RegisterRequest>
export type AuthResponse = v.InferOutput<typeof AuthResponse>
export type RefreshTokenRequest = v.InferOutput<typeof RefreshTokenRequest>
export type RefreshTokenResponse = v.InferOutput<typeof RefreshTokenResponse>
export type UpdateProfileRequest = v.InferOutput<typeof UpdateProfileRequest>
