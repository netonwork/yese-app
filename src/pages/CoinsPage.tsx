import { useState } from 'react'
import { Coins, Calendar, Gift, CreditCard, Download, Plus } from 'lucide-react'

import { Layout } from '@/components/Layout'

interface CoinRecord {
  id: string
  type: 'recharge' | 'earn_register' | 'earn_purchase' | 'earn_renewal' | 'spend_vip' | 'spend_tip' | 'spend_unlock' | 'withdrawal'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending'
  relatedUser?: string
}

export const CoinsPage = () => {


  const [records] = useState<CoinRecord[]>([
    {
      id: '0',
      type: 'recharge',
      amount: 1000,
      description: '支付宝充值',
      date: '2024-01-16 10:30',
      status: 'completed'
    },
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



  const getTypeColor = (type: string) => {
    if (type === 'recharge') {
      return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
    } else if (type.startsWith('earn_')) {
      return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    } else if (type.startsWith('spend_')) {
      return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
    } else if (type === 'withdrawal') {
      return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
    }
    return 'text-gray-600 bg-gray-100'
  }



  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              消费记录
            </h1>
          </div>





          {/* 花币记录 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">

            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {records.map((record) => (
                <div key={record.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* 图标 */}
                      <div className={`p-3 rounded-2xl ${getTypeColor(record.type)} transition-all duration-200 group-hover:scale-110`}>
                        {record.type === 'recharge' && <Plus className="w-5 h-5" />}
                        {record.type.startsWith('earn_') && <Gift className="w-5 h-5" />}
                        {record.type.startsWith('spend_') && <CreditCard className="w-5 h-5" />}
                        {record.type === 'withdrawal' && <Download className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="text-slate-900 dark:text-slate-100 font-medium mb-2">
                          {record.description}
                          {record.status === 'pending' && (
                            <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30 animate-pulse">
                              待结算
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          {record.date}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className={`text-2xl font-bold mb-1 ${
                        record.amount > 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {record.amount > 0 ? '+' : '-'}{Math.abs(record.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        花币
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {records.length === 0 && (
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


        </div>
      </div>
    </Layout>
  )
}
