import { useState } from 'react'
import { 
  User, 
  Crown, 
  Camera, 
  Edit3, 
  Heart, 
  Clock, 
  CreditCard, 
  Gift, 
  LogOut,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '@/components/Layout'

export const ProfilePage = () => {
  const navigate = useNavigate()
  
  const [user] = useState({
    id: '1',
    nickname: '夜色用户',
    avatar: 'https://api.yviii.com/img/meitu',
    isVip: true,
    vipExpireDate: '2024-03-15',
    joinDate: '2023-08-15'
  })

  const handleAvatarChange = () => {
    // 头像上传逻辑
    console.log('上传头像')
  }

  const handleNicknameEdit = () => {
    // 修改昵称逻辑
    console.log('修改昵称')
  }

  const handleLogout = () => {
    // 退出登录逻辑
    console.log('退出登录')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              个人中心
            </h1>
          </div>

          {/* 用户信息卡片 */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 dark:border-slate-700/50 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* 头像 */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                  <img 
                    src={user.avatar} 
                    alt="用户头像"
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <button 
                  onClick={handleAvatarChange}
                  className="absolute -bottom-2 -right-2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* 用户信息 */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {user.nickname}
                  </h2>
                  <button 
                    onClick={handleNicknameEdit}
                    className="p-1.5 text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                {/* VIP状态 */}
                <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                  {user.isVip ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-medium">
                      <Crown className="w-4 h-4" />
                      <span>VIP会员</span>
                      <span className="text-yellow-100">至 {user.vipExpireDate}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm">
                      <User className="w-4 h-4" />
                      <span>普通用户</span>
                    </div>
                  )}
                </div>

                {/* 加入时间 */}
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>加入于 {user.joinDate}</span>
                </div>
              </div>

              {/* VIP升级按钮 */}
              {!user.isVip && (
                <button 
                  onClick={() => navigate('/vip')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 font-medium"
                >
                  升级VIP
                </button>
              )}
            </div>
          </div>

          {/* 功能菜单 */}
          <div className="space-y-6">
            {/* 我的内容 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">我的内容</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <button 
                  onClick={() => navigate('/favorites')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">我的收藏</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button 
                  onClick={() => navigate('/history')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">观看历史</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 钱包与会员 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-slate-100">钱包与会员</h3>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-700">
                <button 
                  onClick={() => navigate('/wallet')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">花币钱包</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button 
                  onClick={() => navigate('/vip')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                      <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">VIP会员</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button 
                  onClick={() => navigate('/share')}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-slate-900 dark:text-slate-100">分享赚花币</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>



            {/* 退出登录 */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-medium">退出登录</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
