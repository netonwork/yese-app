import * as v from 'valibot'
import { apiClient } from './client'
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenResponse,
  UpdateProfileRequest
} from '@/types'

// 验证schemas
import {
  User as UserSchema,
  LoginRequest as LoginRequestSchema,
  RegisterRequest as RegisterRequestSchema,
  AuthResponse as AuthResponseSchema,
  RefreshTokenResponse as RefreshTokenResponseSchema,
  UpdateProfileRequest as UpdateProfileRequestSchema
} from '@/types/auth'

/**
 * 用户登录
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  // 验证请求数据
  const validatedCredentials = v.parse(LoginRequestSchema, credentials)
  
  const response = await apiClient.post<AuthResponse>('/auth/login', validatedCredentials)
  
  // 验证响应数据
  return v.parse(AuthResponseSchema, response)
}

/**
 * 用户注册
 */
export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  // 验证请求数据
  const validatedUserData = v.parse(RegisterRequestSchema, userData)
  
  // 检查密码确认
  if (validatedUserData.password !== validatedUserData.confirmPassword) {
    throw new Error('密码确认不匹配')
  }
  
  const response = await apiClient.post<AuthResponse>('/auth/register', validatedUserData)
  
  // 验证响应数据
  return v.parse(AuthResponseSchema, response)
}

/**
 * 刷新访问令牌
 */
export async function refreshToken(): Promise<RefreshTokenResponse> {
  const refreshToken = localStorage.getItem('refreshToken')
  
  if (!refreshToken) {
    throw new Error('没有可用的刷新令牌')
  }
  
  const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken
  })
  
  // 验证响应数据
  const validatedResponse = v.parse(RefreshTokenResponseSchema, response)
  
  // 更新本地存储的token
  localStorage.setItem('accessToken', validatedResponse.accessToken)
  localStorage.setItem('refreshToken', validatedResponse.refreshToken)
  
  return validatedResponse
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me')
  
  // 验证响应数据
  return v.parse(UserSchema, response)
}

/**
 * 用户登出
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // 无论请求是否成功，都清除本地token
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
}

/**
 * 更新用户资料
 */
export async function updateProfile(profileData: UpdateProfileRequest): Promise<User> {
  // 验证请求数据
  const validatedProfileData = v.parse(UpdateProfileRequestSchema, profileData)
  
  const response = await apiClient.put<User>('/auth/profile', validatedProfileData)
  
  // 验证响应数据
  return v.parse(UserSchema, response)
}

/**
 * 修改密码
 */
export async function changePassword(data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<void> {
  // 验证密码确认
  if (data.newPassword !== data.confirmPassword) {
    throw new Error('新密码确认不匹配')
  }
  
  await apiClient.put('/auth/password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword
  })
}

/**
 * 发送邮箱验证码
 */
export async function sendEmailVerification(email: string): Promise<void> {
  await apiClient.post('/auth/send-verification', { email })
}

/**
 * 验证邮箱
 */
export async function verifyEmail(data: {
  email: string
  code: string
}): Promise<void> {
  await apiClient.post('/auth/verify-email', data)
}

/**
 * 发送密码重置邮件
 */
export async function sendPasswordReset(email: string): Promise<void> {
  await apiClient.post('/auth/forgot-password', { email })
}

/**
 * 重置密码
 */
export async function resetPassword(data: {
  token: string
  newPassword: string
  confirmPassword: string
}): Promise<void> {
  // 验证密码确认
  if (data.newPassword !== data.confirmPassword) {
    throw new Error('密码确认不匹配')
  }
  
  await apiClient.post('/auth/reset-password', {
    token: data.token,
    newPassword: data.newPassword
  })
}

/**
 * 检查用户名是否可用
 */
export async function checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
  const response = await apiClient.get<{ available: boolean }>('/auth/check-username', {
    username
  })
  
  return response
}

/**
 * 检查邮箱是否可用
 */
export async function checkEmailAvailability(email: string): Promise<{ available: boolean }> {
  const response = await apiClient.get<{ available: boolean }>('/auth/check-email', {
    email
  })
  
  return response
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('不支持的文件类型，请上传 JPEG、PNG 或 WebP 格式的图片')
  }
  
  // 验证文件大小 (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('文件大小不能超过 5MB')
  }
  
  const response = await apiClient.upload<{ avatarUrl: string }>('/auth/avatar', file)
  
  return response
}

/**
 * 获取用户会话列表
 */
export async function getUserSessions(): Promise<Array<{
  id: string
  deviceType: string
  deviceName: string
  ipAddress: string
  location: string
  isCurrent: boolean
  lastActiveAt: string
  createdAt: string
}>> {
  const response = await apiClient.get('/auth/sessions')
  return response
}

/**
 * 终止指定会话
 */
export async function terminateSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/auth/sessions/${sessionId}`)
}

/**
 * 终止所有其他会话
 */
export async function terminateAllOtherSessions(): Promise<void> {
  await apiClient.delete('/auth/sessions/others')
}
