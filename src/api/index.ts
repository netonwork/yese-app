// 导出所有API模块
export * from './client'
export * from './auth'
export * from './videos'
export * from './actors'
export * from './user'
export * from './search'

// 导出API客户端实例
export { apiClient } from './client'

// API错误处理工具
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// API响应拦截器
export const handleApiError = (error: any): never => {
  if (error instanceof ApiError) {
    throw error
  }
  
  if (error?.response) {
    // HTTP错误响应
    const { status, data } = error.response
    throw new ApiError(
      data?.message || `HTTP ${status} Error`,
      status,
      data?.code,
      data?.details
    )
  }
  
  if (error?.request) {
    // 网络错误
    throw new ApiError('网络连接失败，请检查网络设置')
  }
  
  // 其他错误
  throw new ApiError(error?.message || '未知错误')
}

// API工具函数
export const createApiUrl = (endpoint: string, params?: Record<string, any>): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
  let url = `${baseUrl}${endpoint}`
  
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
  
  return url
}

// 文件上传工具
export const uploadFile = async (
  endpoint: string,
  file: File,
  options: {
    onProgress?: (progress: number) => void
    additionalData?: Record<string, any>
    maxSize?: number // bytes
    allowedTypes?: string[]
  } = {}
): Promise<any> => {
  const { onProgress, additionalData, maxSize = 10 * 1024 * 1024, allowedTypes } = options
  
  // 验证文件大小
  if (file.size > maxSize) {
    throw new ApiError(`文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`)
  }
  
  // 验证文件类型
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    throw new ApiError(`不支持的文件类型: ${file.type}`)
  }
  
  const formData = new FormData()
  formData.append('file', file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
  }
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    
    // 上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })
    }
    
    // 完成处理
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          resolve(response)
        } catch {
          resolve(xhr.responseText)
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject(new ApiError(error.message || `HTTP ${xhr.status}`, xhr.status, error.code))
        } catch {
          reject(new ApiError(`HTTP ${xhr.status}: ${xhr.statusText}`, xhr.status))
        }
      }
    })
    
    // 错误处理
    xhr.addEventListener('error', () => {
      reject(new ApiError('上传失败，请检查网络连接'))
    })
    
    // 超时处理
    xhr.addEventListener('timeout', () => {
      reject(new ApiError('上传超时，请重试'))
    })
    
    // 设置请求
    const token = localStorage.getItem('accessToken')
    const url = createApiUrl(endpoint)
    
    xhr.open('POST', url)
    xhr.timeout = 60000 // 60秒超时
    
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }
    
    xhr.send(formData)
  })
}

// 批量请求工具
export const batchRequest = async <T>(
  requests: Array<() => Promise<T>>,
  options: {
    concurrency?: number
    onProgress?: (completed: number, total: number) => void
    onError?: (error: any, index: number) => void
  } = {}
): Promise<Array<T | null>> => {
  const { concurrency = 5, onProgress, onError } = options
  const results: Array<T | null> = new Array(requests.length).fill(null)
  let completed = 0
  
  // 分批执行请求
  const executeRequests = async (batch: Array<{ request: () => Promise<T>; index: number }>) => {
    const promises = batch.map(async ({ request, index }) => {
      try {
        const result = await request()
        results[index] = result
        completed++
        onProgress?.(completed, requests.length)
        return result
      } catch (error) {
        onError?.(error, index)
        completed++
        onProgress?.(completed, requests.length)
        return null
      }
    })
    
    await Promise.all(promises)
  }
  
  // 按并发数分批
  for (let i = 0; i < requests.length; i += concurrency) {
    const batch = requests
      .slice(i, i + concurrency)
      .map((request, batchIndex) => ({
        request,
        index: i + batchIndex
      }))
    
    await executeRequests(batch)
  }
  
  return results
}

// 重试工具
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    delay?: number
    backoff?: boolean
    shouldRetry?: (error: any) => boolean
  } = {}
): Promise<T> => {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    shouldRetry = (error) => error?.status >= 500 || error?.code === 'NETWORK_ERROR'
  } = options
  
  let lastError: any
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error
      }
      
      // 等待后重试
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError
}

// 缓存工具
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  ttl: number = 5 * 60 * 1000 // 5分钟默认缓存
): Promise<T> => {
  const cached = cache.get(key)
  const now = Date.now()
  
  if (cached && now - cached.timestamp < cached.ttl) {
    return cached.data
  }
  
  const data = await fn()
  cache.set(key, { data, timestamp: now, ttl })
  
  return data
}

export const clearCache = (pattern?: string): void => {
  if (pattern) {
    const regex = new RegExp(pattern)
    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key)
      }
    }
  } else {
    cache.clear()
  }
}
