import type { ErrorResponse } from '@/types'

// API配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_TIMEOUT = 30000 // 30秒超时

// Token管理
class TokenManager {
  private static instance: TokenManager
  private refreshPromise: Promise<string> | null = null

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager()
    }
    return TokenManager.instance
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken')
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async refreshAccessToken(): Promise<string> {
    // 防止并发刷新
    if (this.refreshPromise) {
      return this.refreshPromise
    }

    this.refreshPromise = this.performRefresh()
    
    try {
      const newToken = await this.refreshPromise
      return newToken
    } finally {
      this.refreshPromise = null
    }
  }

  private async performRefresh(): Promise<string> {
    const refreshToken = this.getRefreshToken()
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    })

    if (!response.ok) {
      this.clearTokens()
      throw new Error('Token refresh failed')
    }

    const data = await response.json()
    this.setTokens(data.accessToken, data.refreshToken)
    
    return data.accessToken
  }
}

// HTTP客户端类
class ApiClient {
  private baseURL: string
  private timeout: number
  private tokenManager: TokenManager

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.tokenManager = TokenManager.getInstance()
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    // 设置默认headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    // 添加认证token
    const accessToken = this.tokenManager.getAccessToken()
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      // 处理401未授权错误，尝试刷新token
      if (response.status === 401 && accessToken) {
        try {
          const newToken = await this.tokenManager.refreshAccessToken()
          
          // 重新发送请求
          const retryHeaders = {
            ...headers,
            Authorization: `Bearer ${newToken}`
          }
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders
          })

          if (!retryResponse.ok) {
            throw await this.handleErrorResponse(retryResponse)
          }

          return await retryResponse.json()
        } catch (refreshError) {
          // 刷新失败，清除token并抛出错误
          this.tokenManager.clearTokens()
          throw refreshError
        }
      }

      if (!response.ok) {
        throw await this.handleErrorResponse(response)
      }

      // 处理空响应
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return {} as T
      }
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      throw error
    }
  }

  private async handleErrorResponse(response: Response): Promise<Error> {
    try {
      const errorData: ErrorResponse = await response.json()
      return new Error(errorData.message || `HTTP ${response.status}`)
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint
    
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            searchParams.set(key, value.join(','))
          } else {
            searchParams.set(key, String(value))
          }
        }
      })
      
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    return this.request<T>(url, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // PATCH请求
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  // 上传文件
  async upload<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    const accessToken = this.tokenManager.getAccessToken()
    const headers: HeadersInit = {}
    
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      headers,
      body: formData
    })
  }
}

// 创建默认客户端实例
export const apiClient = new ApiClient()

// 导出类型和工具
export { TokenManager }
export type { ErrorResponse }
