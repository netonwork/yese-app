import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  User, 
  Settings, 
  Heart, 
  Clock, 
  Crown, 
  LogOut,
  ChevronDown,
  X,
  MessageCircle,
  Share2,
  Download,
  CreditCard,
  RotateCcw,
  MessageSquare
} from 'lucide-react'
import { MobileFooterInfo } from './Footer'

interface UserMenuProps {
  isLoggedIn: boolean
  user?: {
    username: string
    avatar?: string
    isVip: boolean
    vipLevel?: number
    vipExpireDate?: string
    coinBalance: number
  }
  onLogin: () => void
  onLogout: () => void
}

export const UserMenu = ({ isLoggedIn, user, onLogin, onLogout }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 阻止移动端背景滚动
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  if (!isLoggedIn) {
    return (
      <>
        {/* 桌面端登录按钮 */}
        <button
          onClick={onLogin}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          <User className="w-5 h-5" />
          <span>登录</span>
        </button>

        {/* 移动端登录按钮 */}
        <button
          onClick={onLogin}
          className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <User className="w-6 h-6" />
        </button>
      </>
    )
  }

  return (
    <>
      {/* 桌面端用户菜单 */}
      <div className="hidden md:block relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:bg-white/20 dark:hover:bg-slate-700/50 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {user?.username}
            </span>
            {user?.isVip && (
              <span className="text-xs text-orange-500 flex items-center gap-1">
                <Crown className="w-3 h-3" />
                VIP{user.vipLevel}
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* 下拉菜单 */}
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-[9999]">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{user?.username}</div>
                  {user?.isVip ? (
                    <div className="text-sm text-orange-500 flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      VIP{user.vipLevel} 会员
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-400">普通用户</div>
                  )}
                </div>
              </div>
            </div>

            <nav className="py-2">
              <a href="/profile" className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Settings className="w-5 h-5" />
                <span>个人设置</span>
              </a>
              <a href="/favorites" className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Heart className="w-5 h-5" />
                <span>我的收藏</span>
              </a>
              <a href="/history" className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Clock className="w-5 h-5" />
                <span>观看历史</span>
              </a>
              <a href="/messages" className="flex items-center justify-between px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>我的私信</span>
                </div>
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
              </a>
              
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              
              {!user?.isVip && (
                <a href="/vip" className="flex items-center gap-3 px-4 py-2 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors">
                  <Crown className="w-5 h-5" />
                  <span>升级VIP</span>
                </a>
              )}
              
              <a href="/recharge" className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <CreditCard className="w-5 h-5" />
                <span>花币充值 / 余额</span>
              </a>
              
              <a href="/share" className="flex items-center gap-3 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <Share2 className="w-5 h-5" />
                <span>分享赚花币</span>
              </a>
              
              <a href="/chat" className="flex items-center justify-between px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5" />
                  <span>一起扯蛋</span>
                </div>
                <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
              </a>
              
              <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>退出登录</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* 移动端用户按钮 */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-white" />
          )}
        </div>
      </button>

      {/* 移动端侧边栏菜单 - 使用Portal渲染到body */}
      {isMobileMenuOpen && createPortal(
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* 侧边栏 */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-xl transform transition-transform duration-300 ease-out overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                用户中心
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 滚动内容区域 */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent bg-white dark:bg-slate-900">
              {/* 用户信息 */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-medium text-slate-900 dark:text-slate-100">{user?.username}</div>
                    {user?.isVip ? (
                      <div className="text-orange-500 flex items-center gap-1 mt-1">
                        <Crown className="w-4 h-4" />
                        VIP{user.vipLevel} 会员
                      </div>
                    ) : (
                      <div className="text-red-500 flex items-center gap-2 mt-1">
                        <span>无VIP/已过期</span>
                        <button className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                          刷新
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 退出登录按钮 */}
                <button
                  onClick={() => {
                    onLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center justify-center gap-2 w-full p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </div>

              {/* 菜单项 */}
              <nav className="p-4 space-y-1">
                {/* 个人中心 */}
                <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <User className="w-5 h-5" />
                  <span>个人中心</span>
                </a>
                
                {/* 我的收藏 */}
                <a href="/favorites" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Heart className="w-5 h-5" />
                  <span>我的收藏</span>
                </a>
                
                {/* 观看历史 */}
                <a href="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <RotateCcw className="w-5 h-5" />
                  <span>观看历史</span>
                </a>
                
                {/* 我的私信 */}
                <a href="/messages" className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5" />
                    <span>我的私信</span>
                  </div>
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
                </a>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
                
                {/* VIP相关 */}
                <div className="px-4 py-2">
                  <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">无限尽享</div>
                  <a href="/vip" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <Crown className="w-5 h-5 text-orange-500" />
                    <span>VIP ¥39元(RMB)30天</span>
                  </a>
                </div>
                
                {/* 花币充值 */}
                <a href="/recharge" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <CreditCard className="w-5 h-5" />
                  <span>花币充值 / 余额</span>
                </a>
                
                {/* 分享赚花币 */}
                <a href="/share" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>分享赚花币</span>
                </a>
                
                {/* 一起扯蛋 */}
                <a href="/chat" className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5" />
                    <span>一起扯蛋</span>
                  </div>
                  <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">New</span>
                </a>
                
                <div className="border-t border-slate-200 dark:border-slate-700 my-3"></div>
                
                {/* APP下载 */}
                <a href="/download" className="flex items-center justify-center gap-2 mx-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                  <span className="font-medium">APP下载</span>
                </a>
                

              </nav>

              {/* 站点信息 */}
              <div className="mt-8">
                <MobileFooterInfo />
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
