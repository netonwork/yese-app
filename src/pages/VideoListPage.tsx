import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Menu,
  Play,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { VideoGrid } from '@/components/VideoGrid'
import { Pagination } from '@/components/Pagination'
import { MobileSidebar } from '@/components/MobileSidebar'
import { UserMenu } from '@/components/UserMenu'
import { Footer } from '@/components/Footer'
import { FullScreenSearch } from '@/components/FullScreenSearch'
import { useCategories } from '@/hooks/useCategories'

// 模拟数据类型
interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  viewCount: number
  category: string
  actors: string[]
  tags: string[]
  createdAt: string
  badge?: 'hot' | 'exclusive'
}



// 模拟视频数据
const mockVideos: Video[] = Array.from({ length: 48 }, (_, i) => ({
  id: `video-${i + 1}`,
  title: `精彩视频标题 ${i + 1} - 这是一个很长的标题用来测试显示效果`,
  thumbnail: `https://picsum.photos/400/225?random=${i + 1}`,
  duration: `00:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  viewCount: Math.floor(Math.random() * 100000) + 1000,
  category: ['action', 'romance', 'comedy', 'thriller', 'scifi'][Math.floor(Math.random() * 5)],
  actors: Math.random() > 0.3 ? [`演员${i + 1}`, `演员${i + 2}`] : [],
  tags: [`标签${i + 1}`, `标签${i + 2}`, `标签${i + 3}`],
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  ...(Math.random() > 0.7 && { 
    badge: (['hot', 'exclusive'] as const)[Math.floor(Math.random() * 2)]
  })
}))

export const VideoListPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // 获取URL参数
  const categoryId = searchParams.get('category')
  const tagName = searchParams.get('tag')
  const actorName = searchParams.get('actor')
  
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  
  // 模拟用户状态
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user] = useState({
    username: 'smartly',
    avatar: '',
    isVip: false,
    vipLevel: 2,
    vipExpireDate: '2024-03-15',
    coinBalance: 1250
  })
  
  // 获取分类数据
  const { categories } = useCategories()
  
  // 获取当前选中的分类
  // 只有在没有任何筛选参数时，或者明确指定了categoryId时，才选中分类
  // 注意：在视频列表页面中，不会选中"首页"，因为首页不是一个分类筛选
  const selectedCategory = categoryId || ''
  
  const videosPerPage = 20
  const totalPages = Math.ceil(videos.length / videosPerPage)

  // 获取页面标题和描述
  const getPageInfo = () => {
    if (actorName) {
      return {
        title: `${actorName}的视频`,
        subtitle: '演员作品合集',
        description: `${actorName}主演的精彩视频作品，为您呈现最优质的影视内容`,
        mobileTitle: `${actorName}的视频`,
        mobileDescription: `演员作品合集`
      }
    } else if (tagName && categoryId) {
      return {
        title: `${tagName}的视频`,
        subtitle: `标签视频合集`,
        description: `精选${tagName}视频合集，为您呈现最精彩的视听盛宴`,
        mobileTitle: `${tagName}的视频`,
        mobileDescription: `标签视频合集`
      }
    } else if (categoryId && categoryId !== 'all') {
      const categoryNames: { [key: string]: string } = {
        'action': '动作片',
        'romance': '爱情片', 
        'comedy': '喜剧片',
        'thriller': '惊悚片',
        'scifi': '科幻片'
      }
      const categoryName = categoryNames[categoryId] || categoryId
      return {
        title: `${categoryName}的视频`,
        subtitle: '分类视频合集',
        description: `汇聚最新最热的${categoryName}，带您体验不同凡响的视觉震撼`,
        mobileTitle: `${categoryName}的视频`,
        mobileDescription: `分类视频合集`
      }
    } else if (tagName) {
      return {
        title: `${tagName}的视频`,
        subtitle: '标签视频合集',
        description: `发现更多${tagName}相关的精彩内容，满足您的个性化观影需求`,
        mobileTitle: `${tagName}的视频`,
        mobileDescription: `标签视频合集`
      }
    }
    return {
      title: '全部视频',
      subtitle: '海量视频合集',
      description: '汇聚全网优质视频资源，为您提供无限精彩的观影体验',
      mobileTitle: '全部视频',
      mobileDescription: '海量视频合集'
    }
  }

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      let filteredVideos = mockVideos
      
      // 根据分类过滤
      if (categoryId && categoryId !== 'all') {
        filteredVideos = filteredVideos.filter(video => 
          video.category.includes(categoryId)
        )
      }
      
      // 根据标签过滤
      if (tagName) {
        filteredVideos = filteredVideos.filter(video => 
          video.tags.some(tag => tag.includes(tagName))
        )
      }
      
      // 根据演员过滤
      if (actorName) {
        filteredVideos = filteredVideos.filter(video => 
          video.actors.some(actor => actor.includes(actorName))
        )
      }
      
      setVideos(filteredVideos)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [categoryId, tagName, actorName])

  const getCurrentPageVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return videos.slice(startIndex, endIndex)
  }

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

            {/* 搜索按钮 - 只在桌面端显示 */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <button
                onClick={() => {
                  console.log('VideoListPage: 搜索按钮被点击，设置 isSearchOpen 为 true')
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
                  setIsLoggedIn(true)
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
      <div className="flex">
        {/* 左侧分类导航 - 桌面端 */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className="sticky top-20">
            <div className="p-6 space-y-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">视频分类</h2>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    console.log('分类按钮被点击:', category.name, category.id)
                    if (category.id === 'home') {
                      // 点击【首页】时，导航到首页
                      navigate('/')
                    } else {
                      // 点击其他分类时，清除其他筛选参数，只保留分类参数
                      navigate(`/videos?category=${category.id}`)
                    }
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <category.icon className={`w-5 h-5 ${
                      selectedCategory === category.id
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    }`} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  {category.id !== 'home' && (
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      selectedCategory === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {category.videoCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 右侧内容区域 */}
        <main className="flex-1 min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 页面标题 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  <span className="md:hidden">{getPageInfo().mobileTitle}</span>
                  <span className="hidden md:inline">{getPageInfo().title}</span>
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
                  <span className="md:hidden">{getPageInfo().mobileDescription}</span>
                  <span className="hidden md:inline">{getPageInfo().subtitle}</span>
                </p>
              </div>
            </div>

            {/* 视频网格 */}
            <VideoGrid
              videos={getCurrentPageVideos()}
              loading={loading}
              gridCols="grid-cols-1"
              size="medium"
            />

            {/* 分页组件 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* 移动端侧边栏 */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(categoryId) => {
          console.log('移动端分类按钮被点击:', categoryId)
          if (categoryId === 'home') {
            // 点击【首页】时，导航到首页
            navigate('/')
          } else {
            // 点击其他分类时，清除其他筛选参数，只保留分类参数
            navigate(`/videos?category=${categoryId}`)
          }
          setIsSidebarOpen(false)
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
        onClose={() => {
          console.log('VideoListPage: 关闭全屏搜索，设置 isSearchOpen 为 false')
          setIsSearchOpen(false)
        }}
        onSearch={(query) => {
          console.log('VideoListPage: 执行搜索:', query)
          navigate(`/search?q=${encodeURIComponent(query)}`)
        }}
        initialQuery={searchQuery}
      />
    </div>
  )
}