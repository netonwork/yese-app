import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Play, 
  Menu
} from 'lucide-react'
import { MobileSidebar } from './MobileSidebar'
import { UserMenu } from './UserMenu'
import { Footer } from './Footer'
import { FullScreenSearch } from './FullScreenSearch'
import { useCategories } from '@/hooks/useCategories'

interface LayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  showFooter?: boolean
  className?: string
}

export const Layout = ({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  className = ''
}: LayoutProps) => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 模拟用户登录状态和VIP状态
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 模拟已登录
  const [user] = useState({
    username: '用户001',
    avatar: 'https://api.yviii.com/img/meitu?avatar',
    isVip: false, // 模拟非VIP用户
    vipLevel: 1,
    vipExpireDate: '2024-03-15',
    coinBalance: 1250
  })
  
  // 获取分类数据
  const { categories } = useCategories()

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 ${className}`}>
      {/* 顶部导航栏 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左侧：菜单按钮 + Logo */}
            <div className="flex items-center gap-3">
              {/* 移动端菜单按钮 */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                <Play className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text cursor-pointer" onClick={() => navigate('/')}>夜色视频</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">高品质视频平台</p>
              </div>
            </div>

            {/* 搜索框 - 只在桌面端显示 */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <button
                onClick={() => {
                  console.log('Layout: 搜索按钮被点击，设置 isSearchOpen 为 true')
                  setIsSearchOpen(true)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-left"
              >
                <Search className="w-5 h-5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400">搜索视频、演员、标签...</span>
              </button>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center">
              <UserMenu
                isLoggedIn={isLoggedIn}
                {...(isLoggedIn && { user })}
                onLogin={() => {
                  // 模拟登录
                  setIsLoggedIn(true)
                  // 实际项目中这里应该跳转到登录页面
                  // navigate('/login')
                }}
                onLogout={() => {
                  setIsLoggedIn(false)
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>

      {/* 移动端侧边栏 */}
      {showSidebar && (
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={categories}
          selectedCategory=""
          onCategorySelect={(categoryId) => {
            console.log('Layout: 分类选择:', categoryId)
            if (categoryId === 'home') {
              // 点击首页，导航到首页
              navigate('/')
            } else {
              // 点击其他分类，导航到分类页面
              navigate(`/category/${categoryId}`)
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClick={() => setIsSearchOpen(true)}
        />
      )}

      {/* 页脚 */}
      {showFooter && <Footer />}

      {/* 全屏搜索 */}
      <FullScreenSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={(query) => {
          navigate(`/search?q=${encodeURIComponent(query)}`)
        }}
        initialQuery={searchQuery}
      />
    </div>
  )
}
