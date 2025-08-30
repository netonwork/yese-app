import { useState } from 'react'
import { ArrowLeft, Coins, TrendingUp, TrendingDown, Users, Calendar, Filter, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'

interface CoinRecord {
  id: string
  type: 'earn_register' | 'earn_purchase' | 'earn_renewal' | 'spend_vip' | 'spend_tip' | 'spend_unlock' | 'withdrawal'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending'
  relatedUser?: string
}

export const CoinsPage = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('all')
  const [selectedPeriod, setSelectedPeriod] = useState('all')

  const [summary] = useState({
    totalCoins: 1250,
    thisMonth: 380,
    pendingAmount: 150,
    totalWithdrawn: 800,
    totalFriends: 8,
    spentThisMonth: 200
  })

  const [records] = useState<CoinRecord[]>([
    {
      id: '1',
      type: 'earn_purchase',
      amount: 150,
      description: '好友首次购买VIP会员奖励',
      date: '2024-01-15 14:30',
      status: 'completed',
      relatedUser: '张三'
    },
    {
      id: '2',
      type: 'spend_vip',
      amount: -299,
      description: '购买VIP月卡',
      date: '2024-01-14 16:20',
      status: 'completed'
    },
    {
      id: '3',
      type: 'earn_register',
      amount: 50,
      description: '好友注册奖励',
      date: '2024-01-14 09:15',
      status: 'completed',
      relatedUser: '李四'
    },
    {
      id: '4',
      type: 'spend_tip',
      amount: -20,
      description: '打赏作者',
      date: '2024-01-13 20:45',
      status: 'completed'
    },
    {
      id: '5',
      type: 'earn_renewal',
      amount: 75,
      description: '好友续费VIP会员奖励',
      date: '2024-01-13 16:45',
      status: 'completed',
      relatedUser: '王五'
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: -500,
      description: '提现到支付宝',
      date: '2024-01-12 11:20',
      status: 'completed'
    },
    {
      id: '7',
      type: 'spend_unlock',
      amount: -30,
      description: '解锁高清视频',
      date: '2024-01-11 22:30',
      status: 'completed'
    },
    {
      id: '8',
      type: 'earn_purchase',
      amount: 120,
      description: '好友首次购买VIP会员奖励',
      date: '2024-01-11 20:10',
      status: 'pending',
      relatedUser: '赵六'
    }
  ])

  const getTypeLabel = (type: string) => {
    const labels = {
      earn_register: '邀请奖励',
      earn_purchase: '首购奖励',
      earn_renewal: '续费奖励',
      spend_vip: 'VIP消费',
      spend_tip: '打赏消费',
      spend_unlock: '解锁消费',
      withdrawal: '提现'
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeColor = (type: string) => {
    if (type.startsWith('earn_')) {
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    } else if (type.startsWith('spend_')) {
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    } else if (type === 'withdrawal') {
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
    }
    return 'text-gray-600 bg-gray-100'
  }

  const filteredRecords = records.filter(record => {
    if (selectedType === 'earn' && !record.type.startsWith('earn_')) return false
    if (selectedType === 'spend' && !record.type.startsWith('spend_') && record.type !== 'withdrawal') return false
    if (selectedType !== 'all' && selectedType !== 'earn' && selectedType !== 'spend' && record.type !== selectedType) return false
    return true
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面头部 */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                我的花币
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                查看花币收支明细和邀请收益
              </p>
            </div>
          </div>

          {/* 花币概览 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">当前余额</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {summary.totalCoins}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">本月收入</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                +{summary.thisMonth}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">本月支出</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                -{summary.spentThisMonth}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">邀请人数</span>
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100">
                {summary.totalFriends}
              </div>
            </div>
          </div>

          {/* 筛选器 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-500" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">筛选条件</span>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">全部记录</option>
                  <option value="earn">收入记录</option>
                  <option value="spend">支出记录</option>
                  <option value="earn_register">邀请奖励</option>
                  <option value="earn_purchase">首购奖励</option>
                  <option value="earn_renewal">续费奖励</option>
                  <option value="spend_vip">VIP消费</option>
                  <option value="withdrawal">提现记录</option>
                </select>

                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">全部时间</option>
                  <option value="today">今天</option>
                  <option value="week">本周</option>
                  <option value="month">本月</option>
                  <option value="quarter">本季度</option>
                </select>
              </div>
            </div>
          </div>

          {/* 花币记录 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                花币记录 ({filteredRecords.length})
              </h2>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {filteredRecords.map((record) => (
                <div key={record.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(record.type)}`}>
                          {getTypeLabel(record.type)}
                        </span>
                        {record.status === 'pending' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30">
                            待结算
                          </span>
                        )}
                      </div>
                      
                      <div className="text-slate-900 dark:text-slate-100 font-medium mb-1">
                        {record.description}
                        {record.relatedUser && (
                          <span className="text-slate-500 dark:text-slate-400 ml-2">
                            来自好友: {record.relatedUser}
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {record.date}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        record.amount > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {record.amount > 0 ? '+' : ''}{record.amount}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        花币
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="p-12 text-center">
                <div className="text-slate-400 dark:text-slate-500 mb-2">
                  <Coins className="w-12 h-12 mx-auto mb-4 opacity-50" />
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  暂无花币记录
                </div>
              </div>
            )}
          </div>

          {/* 提现按钮 */}
          {summary.totalCoins >= 500 && (
            <div className="mt-8 text-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold">
                <Download className="w-5 h-5 inline-block mr-2" />
                申请提现 ({summary.totalCoins} 花币可提现)
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                最低提现金额500花币，1花币=1元人民币
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
