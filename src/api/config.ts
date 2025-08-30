import { apiClient } from './client'
import type { SiteConfig } from '@/stores/useAppStore'

/**
 * 获取站点配置
 * 这是应用启动时最重要的接口
 */
export const getSiteConfig = async (): Promise<SiteConfig> => {
  const response = await apiClient.get<SiteConfig>('/config/site')
  return response
}

/**
 * 更新站点配置（管理员功能）
 */
export const updateSiteConfig = async (config: Partial<SiteConfig>): Promise<SiteConfig> => {
  const response = await apiClient.put<SiteConfig>('/config/site', config)
  return response
}

/**
 * 获取加密密钥（需要特殊权限）
 */
export const getEncryptionKeys = async (): Promise<{
  imageKey: string
  videoKey: string
  audioKey: string
  algorithm: string
}> => {
  const response = await apiClient.get<{
    imageKey: string
    videoKey: string
    audioKey: string
    algorithm: string
  }>('/config/encryption')
  return response
}

/**
 * 获取CDN配置
 */
export const getCdnConfig = async (): Promise<{
  buckets: Record<string, string[]>
  domains: string[]
  defaultBucket: string
}> => {
  const response = await apiClient.get<{
    buckets: Record<string, string[]>
    domains: string[]
    defaultBucket: string
  }>('/config/cdn')
  return response
}
