import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Search, 
  Play, 
  Menu
} from 'lucide-react'
import { MobileSidebar } from './MobileSidebar'
import { VipAnnouncements } from './VipAnnouncements'
import { AppInstallBanner } from './AppInstallBanner'
import { VideoGrid } from './VideoGrid'
import { Pagination } from './Pagination'
import { UserMenu } from './UserMenu'
import { Footer } from './Footer'
import { FullScreenSearch } from './FullScreenSearch'
import { useCategories } from '@/hooks/useCategories'

// 模拟数据类型
interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  viewCount: number
  rating: number
  category: string
  actors: string[]
  tags: string[]
  createdAt: string
  badge?: 'hot' | 'exclusive'
}



const mockVideos: Video[] = Array.from({ length: 48 }, (_, i) => {
  // 随机生成单个角标
  const badgeTypes: ('hot' | 'exclusive')[] = ['hot', 'exclusive']
  const randomBadge = Math.random() < 0.4 ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : undefined
  
  return {
    id: `video-${i + 1}`,
    title: `精彩视频标题 ${i + 1} - 这是一个很长的标题用来测试显示效果`,
    thumbnail: `https://picsum.photos/400/225?random=${i + 1}`,
    duration: `00:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    viewCount: Math.floor(Math.random() * 100000) + 1000,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    category: ['动作片', '爱情片', '喜剧片', '惊悚片', '科幻片'][Math.floor(Math.random() * 5)] || '动作片',
    actors: Math.random() > 0.3 ? [`演员${i + 1}`, `演员${i + 2}`] : [], // 30%的视频没有演员信息
    tags: ['高清', '热门', '推荐'].slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    ...(randomBadge && { badge: randomBadge })
  }
})

export const HomePage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('home')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // 模拟用户登录状态和VIP状态
  const [isLoggedIn, setIsLoggedIn] = useState(true) // 模拟已登录
  const [user] = useState({
    username: '用户001',
    avatar: 'https://picsum.photos/40/40?random=1',
    isVip: false, // 模拟非VIP用户
    vipLevel: 1,
    vipExpireDate: '2024-03-15',
    coinBalance: 1250
  })
  
  // 获取分类数据
  const { categories } = useCategories()
  

  

  
  const videosPerPage = 20
  const totalVideos = mockVideos.length
  const totalPages = Math.ceil(totalVideos / videosPerPage)

  // 获取当前页的视频
  const getCurrentPageVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    let filteredVideos = mockVideos
    
    if (selectedCategory !== 'home') {
      filteredVideos = mockVideos.filter(video => 
        video.category.includes(selectedCategory)
      )
    }
    
    return filteredVideos.slice(startIndex, endIndex)
  }

  const [videos, setVideos] = useState<Video[]>(getCurrentPageVideos())

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setVideos(getCurrentPageVideos())
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [selectedCategory, currentPage])



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
              
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Play className="w-6 h-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">夜色视频</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">高品质视频平台</p>
              </div>
            </div>

            {/* 搜索框 - 只在桌面端显示 */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <button
                onClick={() => {
                  console.log('HomePage: 搜索按钮被点击，设置 isSearchOpen 为 true')
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

      {/* 主要内容区域 - 左右布局 */}
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
                        console.log('HomePage 桌面端分类按钮:', category.name, category.id)
                        if (category.id === 'home') {
                          // 在首页点击首页，更新选中状态
                          setSelectedCategory(category.id)
                          setCurrentPage(1)
                        } else {
                          // 在首页点击其他分类，导航到分类页面
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
          <main className="flex-1 min-w-0">
            
            {/* 顶部内容区域 */}
            <div className="space-y-4 mb-6">
              {/* 安装APP横幅 */}
              <AppInstallBanner />

              {/* VIP购买公告 */}
              <VipAnnouncements />
            </div>

                                {/* 视频网格 */}
                    <VideoGrid
                      videos={videos}
                      loading={loading}
                    />

            {/* 分页组件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </main>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => {
          console.log('HomePage: 分类选择:', categoryId)
          if (categoryId === 'home') {
            // 在首页点击首页，保持当前状态
            setSelectedCategory(categoryId)
            setCurrentPage(1)
          } else {
            // 在首页点击其他分类，导航到分类页面
            navigate(`/category/${categoryId}`)
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* 页脚 */}
      <Footer />

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
