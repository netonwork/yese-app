import { useState, useEffect } from 'react'
import { ArrowLeft, Crown, Check, Shield, Users, Headphones, Play, Zap, Award, Gift, MessageCircle, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getVipPlans, getVipFeatures } from '@/api/vip'
import type { VipPlan, VipFeature } from '@/types/vip'

// 图标映射
const iconMap = {
  Play,
  Zap,
  Shield,
  Crown,
  Headphones,
  Gift,
  Award,
  Download,
  Users,
  Check
}



export const VipPage = () => {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('quarterly')
  const [loading, setLoading] = useState(false)
  const [vipPlans, setVipPlans] = useState<VipPlan[]>([])
  const [vipFeatures, setVipFeatures] = useState<VipFeature[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  // 获取VIP数据
  useEffect(() => {
    const fetchVipData = async () => {
      try {
        setDataLoading(true)
        const [plansResponse, featuresResponse] = await Promise.all([
          getVipPlans(),
          getVipFeatures()
        ])
        
        setVipPlans(plansResponse.plans)
        setVipFeatures(featuresResponse.features)
      } catch (error) {
        console.error('获取VIP数据失败:', error)
      } finally {
        setDataLoading(false)
      }
    }

    fetchVipData()
  }, [])

  const handlePurchase = async (planId: string) => {
    setLoading(true)
    
    try {
      // 这里调用支付API
      console.log('购买VIP套餐:', planId)
      
      // 模拟支付流程
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 支付成功后的处理
      alert('支付成功！VIP权限已开通')
      navigate('/')
    } catch (error) {
      console.error('支付失败:', error)
      alert('支付失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const selectedPlanData = vipPlans.find(plan => plan.id === selectedPlan)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white">VIP会员</h1>
        <div className="w-10" />
      </header>

      <div className="px-4 pb-24">
        {/* 用户信息区域 */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">用</span>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-medium text-white mb-1">
                用户昵称
              </h2>
              <p className="text-slate-400 text-sm">
                开通VIP会员，解锁全站内容
              </p>
            </div>
          </div>
        </div>

        {/* 套餐选择 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">选择套餐</h3>
          <div className="space-y-3 max-w-2xl mx-auto">
            {dataLoading ? (
              // 加载状态
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border-2 border-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-700 animate-pulse"></div>
                      <div>
                        <div className="h-5 w-20 bg-slate-700 rounded animate-pulse mb-2"></div>
                        <div className="h-4 w-12 bg-slate-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-6 w-16 bg-slate-700 rounded animate-pulse mb-2"></div>
                      <div className="h-4 w-12 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              vipPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border-2 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'border-purple-500 shadow-lg shadow-purple-500/25'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >

                <div className="flex items-center justify-between">
                  {/* 套餐信息 */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center`}>
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                      <p className="text-slate-400 text-sm">{plan.duration}</p>
                    </div>
                  </div>

                  {/* 价格信息 */}
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-white">¥{plan.price}</span>
                      {plan.originalPrice && (
                        <span className="text-sm text-slate-400 line-through">¥{plan.originalPrice}</span>
                      )}
                    </div>
                    {plan.originalPrice && (
                      <div className="mt-1">
                        <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs rounded">
                          省¥{plan.originalPrice - plan.price}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* 选中指示器 */}
                  {selectedPlan === plan.id && (
                    <div className="absolute top-3 left-3">
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* VIP权益说明 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white text-center mb-6">VIP权益</h3>
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 max-w-2xl mx-auto">
            {dataLoading ? (
              <div className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-700 animate-pulse"></div>
                    <div className="h-4 bg-slate-700 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {vipFeatures.map((feature) => {
                  const IconComponent = iconMap[feature.icon as keyof typeof iconMap]
                  return (
                    <div key={feature.id} className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        {IconComponent && <IconComponent className="w-6 h-6 text-white" />}
                      </div>
                      <span className="text-slate-300 text-sm">{feature.title}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* 底部保障 */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h4 className="text-white font-bold text-center mb-4">安全保障</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <Shield className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-slate-300 text-sm font-medium">银行级加密</p>
                <p className="text-slate-500 text-xs">支付信息安全保护</p>
              </div>
              <div>
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-slate-300 text-sm font-medium">7天无理由退款</p>
                <p className="text-slate-500 text-xs">不满意随时退款</p>
              </div>
              <div>
                <Headphones className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <p className="text-slate-300 text-sm font-medium">24小时客服</p>
                <p className="text-slate-500 text-xs">专业团队在线服务</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部悬浮购买按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 p-4 z-50">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => handlePurchase(selectedPlan)}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>支付中...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <Crown className="w-5 h-5" />
                <span>立即开通 ¥{selectedPlanData?.price}</span>
              </div>
            )}
          </button>
          
          {/* 支付说明 */}
          <div className="mt-2 text-center">
            <p className="text-slate-400 text-sm">
              支持支付宝、微信支付，请放心支付
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
