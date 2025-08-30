import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// 用户信息类型
interface User {
  id: string
  username: string
  avatar: string
  isVip: boolean
  vipLevel: number
  vipExpireDate: string
  coinBalance: number
  email?: string
  phone?: string
  joinDate: string
}

// 站点配置类型
export interface SiteConfig {
  // 基础信息
  siteName: string
  logo: string
  domain: string
  version: string
  
  // API 配置
  api: {
    baseUrl: string
    timeout: number
    version: string
    endpoints: {
      auth: string
      video: string
      user: string
      vip: string
      share: string
      upload: string
    }
  }
  
  // CDN 配置
  cdn: {
    buckets: {
      video: string[]     // 视频CDN桶列表
      image: string[]     // 图片CDN桶列表
      audio: string[]     // 音频CDN桶列表
      document: string[]  // 文档CDN桶列表
    }
    domains: string[]     // CDN域名列表
    defaultBucket: string // 默认桶
  }
  
  // 加密配置
  encryption: {
    imageDecryptKey: string    // 图片解密密钥
    videoDecryptKey: string    // 视频解密密钥
    audioDecryptKey: string    // 音频解密密钥
    algorithm: string          // 加密算法
    keyRotationInterval: number // 密钥轮换间隔(小时)
  }
  
  // 功能开关
  features: {
    enableVip: boolean
    enableShare: boolean
    enableCoins: boolean
    enableDownload: boolean
    enableOffline: boolean
    enablePush: boolean
    enableAnalytics: boolean
  }
  
  // 业务配置
  business: {
    maxFreeVideos: number      // 免费观看次数
    vipTrialDays: number       // VIP试用天数
    shareRewardCoins: number   // 分享奖励花币
    inviteRewardCoins: number  // 邀请奖励花币
    coinExchangeRate: number   // 花币兑换比例
    minWithdrawAmount: number  // 最小提现金额
  }
  
  // 第三方服务
  thirdParty: {
    analytics: {
      googleAnalytics?: string
      baiduTongji?: string
    }
    payment: {
      alipay: {
        appId: string
        publicKey: string
      }
      wechat: {
        appId: string
        mchId: string
      }
    }
    push: {
      jpush?: {
        appKey: string
      }
      firebase?: {
        projectId: string
      }
    }
  }
  
  // 安全配置
  security: {
    tokenExpiry: number        // Token过期时间(秒)
    refreshTokenExpiry: number // 刷新Token过期时间(秒)
    maxLoginAttempts: number   // 最大登录尝试次数
    captchaThreshold: number   // 验证码触发阈值
    allowedDomains: string[]   // 允许的域名列表
  }
  
  // 界面配置
  ui: {
    theme: {
      primaryColor: string
      secondaryColor: string
      accentColor: string
    }
    layout: {
      headerHeight: number
      sidebarWidth: number
      footerHeight: number
    }
    pagination: {
      defaultPageSize: number
      maxPageSize: number
    }
  }
}

// 应用状态类型
interface AppState {
  // 邀请相关
  inviteCode: string | null
  setInviteCode: (code: string | null) => void
  clearInviteCode: () => void

  // 用户相关
  user: User | null
  isLoggedIn: boolean
  login: (userData: User) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void

  // 站点配置
  siteConfig: SiteConfig | null
  setSiteConfig: (config: SiteConfig) => void

  // 应用设置
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  
  // 临时状态（不持久化）
  isLoading: boolean
  setLoading: (loading: boolean) => void
  
  // 搜索历史
  searchHistory: string[]
  addSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 邀请相关
      inviteCode: null,
      setInviteCode: (code) => {
        console.log('保存邀请码:', code)
        set({ inviteCode: code })
      },
      clearInviteCode: () => set({ inviteCode: null }),

      // 用户相关
      user: null,
      isLoggedIn: false,
      login: (userData) => {
        console.log('用户登录:', userData.username)
        set({ 
          user: userData, 
          isLoggedIn: true,
          // 登录后清除邀请码
          inviteCode: null 
        })
      },
      logout: () => {
        console.log('用户退出登录')
        set({ 
          user: null, 
          isLoggedIn: false,
          // 退出时保留邀请码，以便重新注册
        })
      },
      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } })
        }
      },

      // 站点配置
      siteConfig: null,
      setSiteConfig: (config) => {
        console.log('设置站点配置:', config.siteName)
        set({ siteConfig: config })
      },

      // 应用设置
      theme: 'system',
      setTheme: (theme) => set({ theme }),

      // 临时状态（不持久化）
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),

      // 搜索历史
      searchHistory: [],
      addSearchHistory: (query) => {
        const { searchHistory } = get()
        const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10)
        set({ searchHistory: newHistory })
      },
      clearSearchHistory: () => set({ searchHistory: [] }),
    }),
    {
      name: 'video-app-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // 只持久化需要的状态，临时状态不持久化
      partialize: (state) => ({
        inviteCode: state.inviteCode,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        siteConfig: state.siteConfig,
        theme: state.theme,
        searchHistory: state.searchHistory,
      }),
    }
  )
)

// 便捷的选择器 hooks
export const useUser = () => useAppStore(state => ({ 
  user: state.user, 
  isLoggedIn: state.isLoggedIn 
}))

export const useInviteCode = () => useAppStore(state => state.inviteCode)

export const useSiteConfig = () => useAppStore(state => state.siteConfig)

export const useTheme = () => useAppStore(state => ({ 
  theme: state.theme, 
  setTheme: state.setTheme 
}))
