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
  showCategorySidebar?: boolean
  className?: string
  selectedCategory?: string
}

export const Layout = ({ 
  children, 
  showSidebar = true, 
  showFooter = true,
  showCategorySidebar = false,
  className = '',
  selectedCategory = ''
}: LayoutProps) => {
  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // 获取分类数据（仅在需要时）
  const { categories } = showCategorySidebar ? useCategories() : { categories: [] }
  
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
        {showCategorySidebar ? (
          /* 带左侧分类导航的布局 */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6 items-start">
              {/* 左侧分类导航 */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="sticky top-24">
                  <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                      视频分类
                    </h3>
                    <nav className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            console.log('Layout 桌面端分类按钮:', category.name, category.id)
                            if (category.id === 'home') {
                              navigate('/')
                            } else {
                              navigate(`/category/${category.id}`)
                            }
                          }}
                          className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                            ${selectedCategory === category.id 
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <category.icon className={`w-5 h-5 ${
                              selectedCategory === category.id 
                                ? 'text-white' 
                                : 'text-slate-600 dark:text-slate-400'
                            }`} />
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <span className={`text-sm ${
                            selectedCategory === category.id 
                              ? 'text-white/80' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {category.videoCount}
                          </span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>
              </aside>

              {/* 右侧主内容区域 */}
              <div className="flex-1 min-w-0">
                {children}
              </div>
            </div>
          </div>
        ) : (
          /* 普通布局 */
          children
        )}
      </main>

      {/* 移动端侧边栏 */}
      {showSidebar && (
        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          categories={showCategorySidebar ? categories : []}
          selectedCategory={selectedCategory}
          onCategorySelect={(categoryId) => {
            console.log('Layout: 分类选择:', categoryId)
            if (categoryId === 'home') {
              navigate('/')
            } else {
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
