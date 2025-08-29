import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { 
  Search, 
  Play, 
  ChevronRight,
  Menu,
  User
} from 'lucide-react'
import { VideoCard } from '@/components/VideoCard'
import { MobileSidebar } from '@/components/MobileSidebar'
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

interface Tag {
  id: string
  name: string
  count: number
  videos: Video[]
}

interface Category {
  id: string
  name: string
  tags: Tag[]
}



// 模拟标签和视频数据
const mockCategories: Category[] = [
  {
    id: 'action',
    name: '动作片',
    tags: [
      {
        id: 'kungfu',
        name: '功夫',
        count: 156,
        videos: Array.from({ length: 6 }, (_, i) => {
          const badgeTypes: ('hot' | 'exclusive')[] = ['hot', 'exclusive']
          const randomBadge = Math.random() < 0.5 ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : undefined
          
          return {
            id: `kungfu-${i + 1}`,
            title: `功夫动作片 ${i + 1} - 精彩武打场面`,
            thumbnail: `https://picsum.photos/400/225?random=${i + 100}`,
            duration: `01:${String(Math.floor(Math.random() * 60) + 30).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            viewCount: Math.floor(Math.random() * 50000) + 10000,
            category: '动作片',
            actors: Math.random() > 0.2 ? [`功夫演员${i + 1}`, `武打明星${i + 1}`] : [],
            tags: ['功夫', '武打', '动作'],
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            ...(randomBadge && { badge: randomBadge })
          }
        })
      },
      {
        id: 'racing',
        name: '赛车',
        count: 89,
        videos: Array.from({ length: 6 }, (_, i) => {
          const badgeTypes: ('hot' | 'exclusive')[] = ['hot', 'exclusive']
          const randomBadge = Math.random() < 0.5 ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : undefined
          
          return {
            id: `racing-${i + 1}`,
            title: `极速赛车 ${i + 1} - 速度与激情`,
            thumbnail: `https://picsum.photos/400/225?random=${i + 200}`,
            duration: `01:${String(Math.floor(Math.random() * 60) + 20).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            viewCount: Math.floor(Math.random() * 80000) + 15000,
            category: '动作片',
            actors: Math.random() > 0.2 ? [`赛车手${i + 1}`, `飞车演员${i + 1}`] : [],
            tags: ['赛车', '速度', '刺激'],
            createdAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
            ...(randomBadge && { badge: randomBadge })
          }
        })
      },
      {
        id: 'spy',
        name: '特工',
        count: 124,
        videos: Array.from({ length: 6 }, (_, i) => {
          const badgeTypes: ('hot' | 'exclusive')[] = ['hot', 'exclusive']
          const randomBadge = Math.random() < 0.5 ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : undefined
          
          return {
            id: `spy-${i + 1}`,
            title: `特工任务 ${i + 1} - 秘密行动`,
            thumbnail: `https://picsum.photos/400/225?random=${i + 300}`,
            duration: `01:${String(Math.floor(Math.random() * 60) + 40).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            viewCount: Math.floor(Math.random() * 60000) + 20000,
            category: '动作片',
            actors: Math.random() > 0.2 ? [`特工${i + 1}`, `间谍${i + 1}`] : [],
            tags: ['特工', '间谍', '悬疑'],
            createdAt: new Date(Date.now() - Math.random() * 21 * 24 * 60 * 60 * 1000).toISOString(),
            ...(randomBadge && { badge: randomBadge })
          }
        })
      }
    ]
  },
  {
    id: 'romance',
    name: '爱情片',
    tags: [
      {
        id: 'sweet',
        name: '甜宠',
        count: 234,
        videos: Array.from({ length: 6 }, (_, i) => ({
          id: `sweet-${i + 1}`,
          title: `甜蜜爱情 ${i + 1} - 浪漫故事`,
          thumbnail: `https://picsum.photos/400/225?random=${i + 400}`,
          duration: `01:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          viewCount: Math.floor(Math.random() * 40000) + 8000,
          category: '爱情片',
          actors: [`甜宠男主${i + 1}`, `甜宠女主${i + 1}`],
          tags: ['甜宠', '浪漫', '爱情'],
          createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString()
        }))
      },
      {
        id: 'classic',
        name: '经典',
        count: 167,
        videos: Array.from({ length: 6 }, (_, i) => ({
          id: `classic-${i + 1}`,
          title: `经典爱情 ${i + 1} - 永恒之恋`,
          thumbnail: `https://picsum.photos/400/225?random=${i + 500}`,
          duration: `01:${String(Math.floor(Math.random() * 60) + 30).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          viewCount: Math.floor(Math.random() * 70000) + 25000,
          category: '爱情片',
          actors: [`经典男主${i + 1}`, `经典女主${i + 1}`],
          tags: ['经典', '怀旧', '感人'],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }))
      }
    ]
  }
]

export const CategoryTagsPage = () => {
  const navigate = useNavigate()
  const { categoryId } = useParams<{ categoryId: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // 获取分类数据
  const { categories } = useCategories()

  // 获取分类信息
  const getCategoryInfo = () => {
    // 从API数据中查找当前分类
    const currentCategory = categories.find(cat => cat.id === categoryId)
    
    if (currentCategory) {
      return {
        name: currentCategory.name,
        description: currentCategory.description || '精彩视频内容',
        mobileTitle: currentCategory.name,
        mobileDescription: currentCategory.description || '精彩内容',
        icon: currentCategory.icon
      }
    }
    
    // 如果没有找到分类，返回默认值
    return {
      name: '未知分类',
      description: '暂无描述',
      mobileTitle: '未知分类',
      mobileDescription: '暂无描述',
      icon: Play // 使用已导入的Play图标作为默认值
    }
  }

  useEffect(() => {
    setLoading(true)
    
    const timer = setTimeout(() => {
      const foundCategory = mockCategories.find(cat => cat.id === categoryId)
      setCategory(foundCategory || null)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [categoryId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">分类不存在</h2>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
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

            {/* 搜索框 - 只在桌面端显示 */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={(e) => {
                e.preventDefault()
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
                }
              }}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="搜索视频、演员、标签..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
                  />
                </div>
              </form>
            </div>

            {/* 右侧操作 */}
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm sm:text-base"
              >
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">登录</span>
              </button>
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
                <nav className="space-y-2">
                  {categories.map((sidebarCategory) => (
                    <button
                      key={sidebarCategory.id}
                      onClick={() => {
                        console.log('CategoryTagsPage 桌面端分类按钮:', sidebarCategory.name, sidebarCategory.id)
                        if (sidebarCategory.id === 'home') {
                          // 点击首页，导航到首页
                          navigate('/')
                        } else {
                          // 点击其他分类，导航到对应分类页面
                          navigate(`/category/${sidebarCategory.id}`)
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                        ${categoryId === sidebarCategory.id 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <sidebarCategory.icon className={`w-5 h-5 ${
                          categoryId === sidebarCategory.id 
                            ? 'text-white' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`} />
                        <span className="font-medium">{sidebarCategory.name}</span>
                      </div>
                      <span className={`text-sm ${
                        categoryId === sidebarCategory.id 
                          ? 'text-white/80' 
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {sidebarCategory.videoCount}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* 右侧主内容区域 */}
          <main className="flex-1 min-w-0">
            {/* 分类描述 */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl p-6 border border-purple-100/50 dark:border-purple-800/30">
                <div className="flex items-center gap-4">
                  {(() => {
                    const IconComponent = getCategoryInfo().icon
                    return <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  })()}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                      <span className="md:hidden">{getCategoryInfo().mobileTitle}</span>
                      <span className="hidden md:inline">{getCategoryInfo().name}</span>
                    </h2>
                    <p className="text-sm md:text-base text-purple-700 dark:text-purple-300">
                      <span className="md:hidden">{getCategoryInfo().mobileDescription}</span>
                      <span className="hidden md:inline">{getCategoryInfo().description}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 分类标签内容 */}
            <div className="space-y-12">
              {category.tags.map((tag) => (
                <section key={tag.id} className="space-y-6">
                  {/* 标签标题 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tag.name}</h2>
                      <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-sm rounded-full">
                        {tag.count} 个视频
                      </span>
                    </div>
                    <Link
                      to={`/videos?category=${categoryId}&tag=${tag.name}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                    >
                      <span>查看全部</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* 视频网格 */}
                  <div>
                    {/* 移动端布局 */}
                    <div className="md:hidden space-y-4">
                      {(() => {
                        // 如果是6个视频，只显示5个
                        const videosToShow = tag.videos.length === 6 ? tag.videos.slice(0, 5) : tag.videos
                        const mobileLayout = []
                        
                        // 第一个视频占一行
                        if (videosToShow.length > 0) {
                          mobileLayout.push(
                            <div key={`first-${videosToShow[0].id}`}>
                              <VideoCard
                                video={videosToShow[0]}
                                size="medium"
                              />
                            </div>
                          )
                        }
                        
                        // 其余视频每行2个
                        for (let i = 1; i < videosToShow.length; i += 2) {
                          const rowVideos = videosToShow.slice(i, i + 2)
                          mobileLayout.push(
                            <div key={`row-${i}`} className="grid grid-cols-2 gap-4">
                              {rowVideos.map((video) => (
                                <VideoCard
                                  key={video.id}
                                  video={video}
                                  size="small"
                                />
                              ))}
                            </div>
                          )
                        }
                        
                        return mobileLayout
                      })()}
                    </div>
                    
                    {/* 桌面端布局 */}
                    <div className="hidden md:grid md:grid-cols-3 gap-8">
                      {tag.videos.map((video) => (
                        <VideoCard
                          key={video.id}
                          video={video}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={categories}
        selectedCategory={categoryId || ''}
        onCategorySelect={(selectedCategoryId) => {
          console.log('CategoryTagsPage: 分类选择:', selectedCategoryId)
          if (selectedCategoryId === 'home') {
            // 点击首页，导航到首页
            navigate('/')
          } else {
            // 点击其他分类，导航到对应分类页面
            navigate(`/category/${selectedCategoryId}`)
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  )
}
