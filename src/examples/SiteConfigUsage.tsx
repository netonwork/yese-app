import React from 'react'
import { 
  useSiteConfig, 
  useFeatureEnabled, 
  useCdnUrl, 
  useApiEndpoint,
  useBusinessConfig,
  useEncryptionConfig 
} from '@/hooks/useSiteConfig'

/**
 * 站点配置使用示例
 * 展示如何在组件中使用各种配置
 */
export const SiteConfigUsageExample: React.FC = () => {
  // 获取完整站点配置
  const siteConfig = useSiteConfig()
  
  // 检查功能是否启用
  const isVipEnabled = useFeatureEnabled('enableVip')
  const isShareEnabled = useFeatureEnabled('enableShare')
  const isCoinsEnabled = useFeatureEnabled('enableCoins')
  
  // 获取 CDN URL 生成器
  const getCdnUrl = useCdnUrl()
  
  // 获取 API 端点
  const getApiEndpoint = useApiEndpoint()
  
  // 获取业务配置
  const businessConfig = useBusinessConfig()
  
  // 获取加密配置
  const encryptionConfig = useEncryptionConfig()

  if (!siteConfig) {
    return <div>站点配置加载中...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">站点配置使用示例</h1>
      
      {/* 基础信息 */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">基础信息</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">站点名称</label>
            <p className="text-sm text-gray-900">{siteConfig.siteName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">版本</label>
            <p className="text-sm text-gray-900">{siteConfig.version}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">域名</label>
            <p className="text-sm text-gray-900">{siteConfig.domain}</p>
          </div>
        </div>
      </section>

      {/* 功能开关 */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">功能开关</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${isVipEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">VIP功能: {isVipEnabled ? '启用' : '禁用'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${isShareEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">分享功能: {isShareEnabled ? '启用' : '禁用'}</span>
          </div>
          <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-2 ${isCoinsEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm">花币功能: {isCoinsEnabled ? '启用' : '禁用'}</span>
          </div>
        </div>
      </section>

      {/* CDN 配置示例 */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">CDN 使用示例</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">视频 CDN URL</label>
            <p className="text-sm text-gray-900 font-mono">
              {getCdnUrl('example-video.mp4', 'video')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">图片 CDN URL</label>
            <p className="text-sm text-gray-900 font-mono">
              {getCdnUrl('example-image.jpg', 'image')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">音频 CDN URL</label>
            <p className="text-sm text-gray-900 font-mono">
              {getCdnUrl('example-audio.mp3', 'audio')}
            </p>
          </div>
        </div>
      </section>

      {/* API 端点示例 */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">API 端点示例</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">认证 API</label>
            <p className="text-sm text-gray-900 font-mono">{getApiEndpoint('auth')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">视频 API</label>
            <p className="text-sm text-gray-900 font-mono">{getApiEndpoint('video')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">用户 API</label>
            <p className="text-sm text-gray-900 font-mono">{getApiEndpoint('user')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">VIP API</label>
            <p className="text-sm text-gray-900 font-mono">{getApiEndpoint('vip')}</p>
          </div>
        </div>
      </section>

      {/* 业务配置 */}
      {businessConfig && (
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">业务配置</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">免费观看次数</label>
              <p className="text-sm text-gray-900">{businessConfig.maxFreeVideos} 次</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">VIP试用天数</label>
              <p className="text-sm text-gray-900">{businessConfig.vipTrialDays} 天</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">邀请奖励</label>
              <p className="text-sm text-gray-900">{businessConfig.inviteRewardCoins} 花币</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">分享奖励</label>
              <p className="text-sm text-gray-900">{businessConfig.shareRewardCoins} 花币</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">最小提现金额</label>
              <p className="text-sm text-gray-900">{businessConfig.minWithdrawAmount} 花币</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">花币兑换比例</label>
              <p className="text-sm text-gray-900">1 花币 = ¥{businessConfig.coinExchangeRate}</p>
            </div>
          </div>
        </section>
      )}

      {/* 加密配置 */}
      {encryptionConfig && (
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">加密配置</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">加密算法</label>
              <p className="text-sm text-gray-900">{encryptionConfig.algorithm}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">密钥轮换间隔</label>
              <p className="text-sm text-gray-900">{encryptionConfig.keyRotationInterval} 小时</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">图片解密密钥</label>
              <p className="text-sm text-gray-900 font-mono">
                {encryptionConfig.imageDecryptKey.substring(0, 20)}...
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">视频解密密钥</label>
              <p className="text-sm text-gray-900 font-mono">
                {encryptionConfig.videoDecryptKey.substring(0, 20)}...
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 使用示例代码 */}
      <section className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">使用示例代码</h2>
        <pre className="text-sm bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
{`// 在组件中使用站点配置
import { 
  useFeatureEnabled, 
  useCdnUrl, 
  useBusinessConfig 
} from '@/hooks/useSiteConfig'

const MyComponent = () => {
  // 检查功能是否启用
  const isVipEnabled = useFeatureEnabled('enableVip')
  
  // 获取 CDN URL
  const getCdnUrl = useCdnUrl()
  const imageUrl = getCdnUrl('avatar.jpg', 'image')
  
  // 获取业务配置
  const businessConfig = useBusinessConfig()
  const maxFreeVideos = businessConfig?.maxFreeVideos || 0
  
  return (
    <div>
      {isVipEnabled && <VipButton />}
      <img src={imageUrl} alt="头像" />
      <p>免费观看次数: {maxFreeVideos}</p>
    </div>
  )
}`}
        </pre>
      </section>
    </div>
  )
}

export default SiteConfigUsageExample
