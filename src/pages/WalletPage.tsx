import { useState } from 'react'
import { Wallet, Download, Gift, Plus, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'

export const WalletPage = () => {
  const navigate = useNavigate()

  const [summary] = useState({
    totalCoins: 1250,
    thisMonth: 380,
    pendingAmount: 150,
    totalWithdrawn: 800,
    totalFriends: 8,
    spentThisMonth: 200
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              花币钱包
            </h1>
          </div>

          {/* 主要余额卡片 */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                      <Wallet className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-white/90">花币钱包</h2>
                      <p className="text-white/70 text-sm">Coin Wallet</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl md:text-4xl font-bold text-white">
                      {summary.totalCoins.toLocaleString()}
                    </div>
                    <div className="text-white/80 text-sm">可用余额</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-white/70 text-xs mb-1">待结算</div>
                    <div className="text-white font-semibold">{summary.pendingAmount}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-white/70 text-xs mb-1">已提现</div>
                    <div className="text-white font-semibold">{summary.totalWithdrawn}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-white/70 text-xs mb-1">邀请人数</div>
                    <div className="text-white font-semibold">{summary.totalFriends}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷操作 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <button className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105 group">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">充值花币</span>
              </div>
            </button>

            <button 
              className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105 group ${
                summary.totalCoins < 500 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={summary.totalCoins < 500}
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                  <Download className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">申请提现</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/share')}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                  <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">邀请赚币</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/coins')}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-2xl group-hover:scale-110 transition-transform">
                  <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">消费记录</span>
              </div>
            </button>
          </div>



          {/* 提现进度 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">提现进度</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">最低提现500花币</span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>当前余额: {summary.totalCoins} 花币</span>
                <span>{summary.totalCoins >= 500 ? '可以提现' : `还需 ${500 - summary.totalCoins} 花币`}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((summary.totalCoins / 500) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {summary.totalCoins >= 500 ? (
              <button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105">
                立即提现 {summary.totalCoins} 花币
              </button>
            ) : (
              <div className="text-center">
                <button 
                  onClick={() => navigate('/share')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  邀请好友赚花币
                </button>
              </div>
            )}
          </div>

          {/* 温馨提示 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">
              💡 温馨提示
            </h3>
            <div className="space-y-2 text-sm text-amber-700 dark:text-amber-300">
              <p>• 花币可用于购买VIP会员、打赏作者、解锁高清内容等</p>
              <p>• 邀请好友注册和充值可获得花币奖励，多邀多得</p>
              <p>• 提现最低金额500花币，1花币=1元人民币</p>
              <p>• 提现申请将在1-3个工作日内处理完成</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
