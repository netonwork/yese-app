import { useEffect, useRef } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { getSiteConfig } from '@/api/config'

/**
 * 应用初始化 Hook
 * 处理邀请码、站点配置等初始化逻辑
 */
export const useAppInit = () => {
  const setInviteCode = useAppStore(state => state.setInviteCode)
  const setSiteConfig = useAppStore(state => state.setSiteConfig)
  const setLoading = useAppStore(state => state.setLoading)
  const hasInitialized = useRef(false)

  useEffect(() => {
    // 防止重复初始化
    if (hasInitialized.current) {
      return
    }
    hasInitialized.current = true
    const initializeApp = async () => {
      console.log('开始初始化应用...')
      setLoading(true)

      try {
        // 1. 处理邀请码
        const currentSearchParams = new URLSearchParams(window.location.search)
        const inviteCode = currentSearchParams.get('invite')
        if (inviteCode) {
          console.log('检测到邀请码:', inviteCode)
          setInviteCode(inviteCode)
          
          // 可以调用API记录邀请点击
          // await recordInviteClick(inviteCode)
        }

        // 2. 获取站点配置（这是最重要的初始化步骤）
        // 在生产环境中直接使用默认配置，开发环境尝试从API获取
        if (import.meta.env.PROD) {
          console.log('生产环境，使用默认站点配置')
          // 直接使用默认配置
          const defaultConfig = {
            siteName: '夜色视频',
            logo: '/logo.png',
            domain: window.location.origin,
            version: '1.0.0',
            api: {
              baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
              timeout: 30000,
              version: 'v1',
              endpoints: {
                auth: '/auth',
                video: '/videos',
                user: '/user',
                vip: '/vip',
                share: '/share',
                upload: '/upload'
              }
            },
            cdn: {
              buckets: {
                video: ['video-bucket-1', 'video-bucket-2'],
                image: ['image-bucket-1', 'image-bucket-2'],
                audio: ['audio-bucket-1'],
                document: ['doc-bucket-1']
              },
              domains: ['cdn1.yese.tv', 'cdn2.yese.tv'],
              defaultBucket: 'video-bucket-1'
            },
            encryption: {
              imageDecryptKey: 'default-image-key',
              videoDecryptKey: 'default-video-key',
              audioDecryptKey: 'default-audio-key',
              algorithm: 'AES-256-CBC',
              keyRotationInterval: 24
            },
            features: {
              enableVip: true,
              enableShare: true,
              enableCoins: true,
              enableDownload: false,
              enableOffline: false,
              enablePush: true,
              enableAnalytics: true
            },
            business: {
              maxFreeVideos: 3,
              vipTrialDays: 7,
              shareRewardCoins: 10,
              inviteRewardCoins: 50,
              coinExchangeRate: 0.01,
              minWithdrawAmount: 500
            },
            thirdParty: {
              analytics: {
                googleAnalytics: 'GA_TRACKING_ID',
                baiduTongji: 'BAIDU_SITE_ID'
              },
              payment: {
                alipay: {
                  appId: 'ALIPAY_APP_ID',
                  publicKey: 'ALIPAY_PUBLIC_KEY'
                },
                wechat: {
                  appId: 'WECHAT_APP_ID',
                  mchId: 'WECHAT_MCH_ID'
                }
              },
              push: {
                jpush: {
                  appKey: 'JPUSH_APP_KEY'
                }
              }
            },
            security: {
              tokenExpiry: 7200,
              refreshTokenExpiry: 604800,
              maxLoginAttempts: 5,
              captchaThreshold: 3,
              allowedDomains: ['yese.tv', '*.yese.tv']
            },
            ui: {
              theme: {
                primaryColor: '#8b5cf6',
                secondaryColor: '#ec4899',
                accentColor: '#06b6d4'
              },
              layout: {
                headerHeight: 64,
                sidebarWidth: 256,
                footerHeight: 80
              },
              pagination: {
                defaultPageSize: 20,
                maxPageSize: 100
              }
            }
          }
          setSiteConfig(defaultConfig)
        } else {
          // 开发环境，尝试从API获取配置
          try {
            console.log('开发环境，正在获取站点配置...')
            const siteConfig = await getSiteConfig()
            console.log('获取到的站点配置:', siteConfig)
            console.log('配置类型:', typeof siteConfig)
            console.log('siteName 字段:', siteConfig?.siteName)
            
            if (siteConfig && typeof siteConfig === 'object' && siteConfig.siteName) {
              console.log('站点配置获取成功:', siteConfig.siteName)
              setSiteConfig(siteConfig)
            } else {
              console.error('站点配置验证失败:', {
                hasConfig: !!siteConfig,
                configType: typeof siteConfig,
                hasSiteName: !!siteConfig?.siteName,
                siteName: siteConfig?.siteName
              })
              throw new Error('站点配置数据格式错误')
            }
          } catch (error) {
            console.error('获取站点配置失败，使用默认配置:', error)
            // 使用默认配置作为降级方案
            const defaultConfig = {
              siteName: '夜色视频',
              logo: '/logo.png',
              domain: window.location.origin,
              version: '1.0.0',
              api: {
                baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
                timeout: 30000,
                version: 'v1',
                endpoints: {
                  auth: '/auth',
                  video: '/videos',
                  user: '/user',
                  vip: '/vip',
                  share: '/share',
                  upload: '/upload'
                }
              },
              cdn: {
                buckets: {
                  video: ['video-bucket-1', 'video-bucket-2'],
                  image: ['image-bucket-1', 'image-bucket-2'],
                  audio: ['audio-bucket-1'],
                  document: ['doc-bucket-1']
                },
                domains: ['cdn1.yese.tv', 'cdn2.yese.tv'],
                defaultBucket: 'video-bucket-1'
              },
              encryption: {
                imageDecryptKey: 'default-image-key',
                videoDecryptKey: 'default-video-key',
                audioDecryptKey: 'default-audio-key',
                algorithm: 'AES-256-CBC',
                keyRotationInterval: 24
              },
              features: {
                enableVip: true,
                enableShare: true,
                enableCoins: true,
                enableDownload: false,
                enableOffline: false,
                enablePush: true,
                enableAnalytics: true
              },
              business: {
                maxFreeVideos: 3,
                vipTrialDays: 7,
                shareRewardCoins: 10,
                inviteRewardCoins: 50,
                coinExchangeRate: 0.01,
                minWithdrawAmount: 500
              },
              thirdParty: {
                analytics: {
                  googleAnalytics: 'GA_TRACKING_ID',
                  baiduTongji: 'BAIDU_SITE_ID'
                },
                payment: {
                  alipay: {
                    appId: 'ALIPAY_APP_ID',
                    publicKey: 'ALIPAY_PUBLIC_KEY'
                  },
                  wechat: {
                    appId: 'WECHAT_APP_ID',
                    mchId: 'WECHAT_MCH_ID'
                  }
                },
                push: {
                  jpush: {
                    appKey: 'JPUSH_APP_KEY'
                  }
                }
              },
              security: {
                tokenExpiry: 7200,
                refreshTokenExpiry: 604800,
                maxLoginAttempts: 5,
                captchaThreshold: 3,
                allowedDomains: ['yese.tv', '*.yese.tv']
              },
              ui: {
                theme: {
                  primaryColor: '#8b5cf6',
                  secondaryColor: '#ec4899',
                  accentColor: '#06b6d4'
                },
                layout: {
                  headerHeight: 64,
                  sidebarWidth: 256,
                  footerHeight: 80
                },
                pagination: {
                  defaultPageSize: 20,
                  maxPageSize: 100
                }
              }
            }
            setSiteConfig(defaultConfig)
          }
        }

        // 3. 检查用户登录状态
        // 如果有token，可以验证并刷新用户信息
        const token = localStorage.getItem('authToken')
        if (token) {
          try {
            // 验证token并获取用户信息
            // const userInfo = await getUserInfo()
            // login(userInfo)
            console.log('检测到登录token，需要验证用户信息')
          } catch (error) {
            console.log('Token验证失败，清除登录状态')
            localStorage.removeItem('authToken')
          }
        }

        // 4. 其他初始化逻辑
        // 比如获取分类数据、配置信息等

      } catch (error) {
        console.error('应用初始化失败:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeApp()
  }, []) // 空依赖数组，只在组件挂载时执行一次

  // 不返回任何状态，避免可能的循环依赖
  return {
    isInitialized: true // 简化返回值
  }
}
