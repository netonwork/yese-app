import { useState, useEffect } from 'react'
import { Copy, Gift, Coins, Users, TrendingUp, CheckCircle, ExternalLink, Play } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { getShareData } from '@/api/share'
import type { ShareConfig, ShareStats } from '@/types/share'

export const ShareEarnPage = () => {
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shareUrl, setShareUrl] = useState('')
  const [config, setConfig] = useState<ShareConfig | null>(null)
  const [stats, setStats] = useState<ShareStats | null>(null)

  // 获取分享数据
  useEffect(() => {
    const fetchShareData = async () => {
      try {
        setLoading(true)
        const data = await getShareData()
        console.log('获取到的分享数据:', data) // 调试信息
        
        if (!data) {
          throw new Error('API返回数据为空')
        }
        
        if (!data.config) {
          throw new Error('API返回数据中缺少config字段')
        }
        
        if (!data.stats) {
          throw new Error('API返回数据中缺少stats字段')
        }
        
        setConfig(data.config)
        setStats(data.stats)
        setShareUrl(data.inviteUrl || '')
      } catch (error) {
        console.error('获取分享数据失败:', error)
        // 设置默认值以防止页面崩溃
        setConfig({
          registerReward: 5,
          firstPurchaseRewardPercent: 30,
          renewalRewardPercent: 15,
          minWithdrawAmount: 500,
          coinToRmbRate: 1,
          freeViewsPerInvite: 5,
          viewsPerVideo: 1
        })
        setStats({
          totalCoins: 0,
          totalInvites: 0,
          monthlyEarnings: 0,
          freeViews: 0,
          pendingRewards: 0
        })
        setShareUrl('https://yese.tv/share/default')
      } finally {
        setLoading(false)
      }
    }

    fetchShareData()
  }, [])

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  // 加载状态
  if (loading || !config || !stats) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto mb-8"></div>
              <div className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6 mb-8">
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white/80 dark:bg-slate-800/80 rounded-2xl p-6">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }



  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 分享好处描述 */}
          <div className="mb-6">
            <p className="text-center text-slate-600 dark:text-slate-400">
              邀请好友注册获得{config.freeViewsPerInvite}次白嫖机会，好友充值VIP你还能赚{config.firstPurchaseRewardPercent}%花币，花币满{config.minWithdrawAmount}可提现
            </p>
          </div>

          {/* 邀请链接 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Copy className="w-6 h-6 text-blue-500" />
              邀请链接
            </h2>

            {/* 分享链接 - 第一行 */}
            <div className="mb-4">
              <div className="px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                <span className="text-sm text-slate-600 dark:text-slate-400 break-all">
                  {shareUrl}
                </span>
              </div>
            </div>

            {/* 复制按钮 - 第二行 */}
            <div className="mb-4">
              <button
                onClick={handleCopyUrl}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold"
              >
                {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? '已复制' : '复制链接'}
              </button>
            </div>

            {/* 提示文字 - 按钮下面 */}
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
              复制链接发给好友，好友点击注册即可
            </p>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">总花币</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalCoins.toLocaleString()}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">邀请人数</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.totalInvites}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">本月收益</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.monthlyEarnings}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3 mb-2">
                <Play className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">白嫖次数</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.freeViews}
              </div>
            </div>
          </div>

          {/* 查看花币按钮 */}
          <div className="text-center mb-8">
            <button
              onClick={() => window.open('/coins', '_blank')}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 font-semibold mx-auto"
            >
              <Coins className="w-5 h-5" />
              查看我的花币
            </button>
          </div>

          {/* 奖励规则 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
              <Gift className="w-6 h-6 text-purple-500" />
              邀请奖励
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      好友注册奖励
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      好友通过你的邀请链接注册，你和好友都获得 <span className="font-semibold text-purple-600">{config.freeViewsPerInvite}次白嫖机会</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      首次充值奖励
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      好友首次购买VIP，你获得其消费金额 <span className="font-semibold text-yellow-600">{config.firstPurchaseRewardPercent}%</span> 的花币奖励
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      持续收益
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      好友每次续费VIP，持续获得 <span className="font-semibold text-yellow-600">{config.renewalRewardPercent}%</span> 的花币奖励
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      白嫖说明
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      白嫖次数可免费观看完整视频，<span className="font-semibold text-purple-600">每次观看消耗{config.viewsPerVideo}次</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 温馨提示 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3 flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              温馨提示
            </h3>
            <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <p>• 好友通过你的邀请链接注册，操作简单无需填写邀请码</p>
              <p>• 注册成功后你和好友都立即获得{config.freeViewsPerInvite}次白嫖机会</p>
              <p>• 好友购买VIP时你还能获得花币奖励，24小时内到账</p>
              <p>• 花币可用于购买VIP、解锁内容、打赏作者等，满{config.minWithdrawAmount}花币可提现</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
