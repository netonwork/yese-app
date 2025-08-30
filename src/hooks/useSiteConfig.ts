import { useAppStore, type SiteConfig } from '@/stores/useAppStore'

/**
 * 站点配置相关的便捷 hooks
 */

// 获取完整站点配置
export const useSiteConfig = () => {
  return useAppStore(state => state.siteConfig)
}

// 获取 API 配置
export const useApiConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.api || null
}

// 获取 CDN 配置
export const useCdnConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.cdn || null
}

// 获取加密配置
export const useEncryptionConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.encryption || null
}

// 获取功能开关
export const useFeatures = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.features || null
}

// 获取业务配置
export const useBusinessConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.business || null
}

// 获取第三方服务配置
export const useThirdPartyConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.thirdParty || null
}

// 获取安全配置
export const useSecurityConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.security || null
}

// 获取 UI 配置
export const useUIConfig = () => {
  const siteConfig = useAppStore(state => state.siteConfig)
  return siteConfig?.ui || null
}

// 检查功能是否启用
export const useFeatureEnabled = (feature: keyof NonNullable<SiteConfig['features']>) => {
  const features = useFeatures()
  return features?.[feature] ?? false
}

// 获取 CDN 资源 URL
export const useCdnUrl = () => {
  const cdnConfig = useCdnConfig()
  
  return (resourcePath: string, type: 'video' | 'image' | 'audio' | 'document' = 'image') => {
    if (!cdnConfig) return resourcePath
    
    const buckets = cdnConfig.buckets[type]
    if (!buckets || buckets.length === 0) return resourcePath
    
    // 简单的负载均衡：根据资源路径选择桶
    const bucketIndex = Math.abs(resourcePath.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % buckets.length
    const bucket = buckets[bucketIndex]
    
    // 选择 CDN 域名
    const domains = cdnConfig.domains
    if (domains && domains.length > 0) {
      const domainIndex = bucketIndex % domains.length
      const domain = domains[domainIndex]
      return `https://${domain}/${bucket}/${resourcePath}`
    }
    
    return `/${bucket}/${resourcePath}`
  }
}

// 获取 API 端点 URL
export const useApiEndpoint = () => {
  const apiConfig = useApiConfig()
  
  return (endpoint: keyof NonNullable<SiteConfig['api']['endpoints']>) => {
    if (!apiConfig) return `/api/${endpoint}`
    
    const baseUrl = apiConfig.baseUrl
    const endpointPath = apiConfig.endpoints[endpoint]
    
    return `${baseUrl}${endpointPath}`
  }
}

// 获取支付配置
export const usePaymentConfig = () => {
  const thirdParty = useThirdPartyConfig()
  return thirdParty?.payment || null
}

// 获取推送配置
export const usePushConfig = () => {
  const thirdParty = useThirdPartyConfig()
  return thirdParty?.push || null
}

// 获取分析配置
export const useAnalyticsConfig = () => {
  const thirdParty = useThirdPartyConfig()
  return thirdParty?.analytics || null
}
