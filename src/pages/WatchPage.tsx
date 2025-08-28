import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { 
  Search, 
  Play, 
  Menu,
  Heart,
  Share2,
  Download,
  Eye,
  ThumbsUp,
  Calendar,
  Clock,
  Users,
  Tag,
  ShoppingCart,
  UserPlus,
  Coins,
  X,
  Crown
} from 'lucide-react'
import { MobileSidebar } from '@/components/MobileSidebar'
import { UserMenu } from '@/components/UserMenu'
import { Footer } from '@/components/Footer'
import { FullScreenSearch } from '@/components/FullScreenSearch'
import { VideoCard } from '@/components/VideoCard'
import { VipAnnouncements } from '@/components/VipAnnouncements'
import { useCategories } from '@/hooks/useCategories'

// 视频详情数据类型
interface VideoDetail {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  duration: string
  viewCount: number
  likeCount: number
  favoriteCount: number
  commentCount: number
  rating: number
  ratingCount: number
  category: string
  tags: string[]
  actors: string[]
  director?: string
  releaseDate: string
  createdAt: string
  badge?: 'hot' | 'exclusive'
}

// 模拟视频详情数据
const mockVideoDetail: VideoDetail = {
  id: '1',
  title: '功夫动作片 1 - 精彩武打场面',
  description: '这是一部精彩的功夫动作片，讲述了一个年轻武者的成长故事。影片中包含了大量精彩的武打场面，展现了中国传统武术的魅力。剧情跌宕起伏，人物形象鲜明，是一部不可多得的佳作。',
  thumbnail: 'https://picsum.photos/800/450?random=1',
  videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  duration: '01:18:56',
  viewCount: 27000,
  likeCount: 1250,
  favoriteCount: 890,
  commentCount: 156,
  rating: 4.8,
  ratingCount: 234,
  category: '动作片',
  tags: ['功夫', '武打', '动作', '经典'],
  actors: ['功夫演员1', '功夫演员2', '功夫演员3'],
  director: '知名导演',
  releaseDate: '2024-01-15',
  createdAt: '2024-01-20T10:00:00Z',
  badge: 'hot'
}

// 模拟相关视频数据
const generateRelatedVideos = (mainTag: string, count: number = 12) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `related-${i + 1}`,
    title: `${mainTag}相关视频 ${i + 1} - 精彩内容`,
    thumbnail: `https://picsum.photos/400/225?random=${i + 100}`,
    duration: `00:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
    viewCount: Math.floor(Math.random() * 100000) + 1000,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
    category: '动作片',
    actors: [`演员${i + 1}`, `演员${i + 2}`],
    tags: [mainTag, '热门', '推荐'].slice(0, Math.floor(Math.random() * 3) + 1),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))
}

export const WatchPage = () => {
  const navigate = useNavigate()
  const { videoId } = useParams<{ videoId: string }>()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 获取分类数据
  const { categories } = useCategories()

  // 模拟用户状态
  const [isLoggedIn] = useState(true) // 模拟已登录
  const [user] = useState({
    username: 'smartly',
    avatar: '',
    isVip: false, // 模拟非VIP用户
    vipLevel: 2,
    vipExpireDate: '2024-03-15',
    coinBalance: 1250
  })

  // VIP横幅显示控制
  const [showVipBanner, setShowVipBanner] = useState(false)
  const [vipBannerVisible, setVipBannerVisible] = useState(false)

  // 检测VIP状态并控制横幅显示
  useEffect(() => {
    // 如果用户未登录或已是VIP，不显示横幅
    if (!isLoggedIn || user.isVip) {
      return
    }

    // 3秒后显示VIP横幅
    const timer = setTimeout(() => {
      setShowVipBanner(true)
      // 延迟一点让动画更自然
      setTimeout(() => {
        setVipBannerVisible(true)
      }, 100)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isLoggedIn, user.isVip])

  // 关闭VIP横幅
  const closeVipBanner = () => {
    setVipBannerVisible(false)
    setTimeout(() => {
      setShowVipBanner(false)
    }, 300) // 等待动画完成
  }

  // 加载视频详情
  useEffect(() => {
    const loadVideoDetail = async () => {
      setLoading(true)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 设置视频详情
      setVideoDetail(mockVideoDetail)
      
      // 根据主标签生成相关视频
      const mainTag = mockVideoDetail.tags[0] || '动作'
      setRelatedVideos(generateRelatedVideos(mainTag))
      
      setLoading(false)
    }

    if (videoId) {
      loadVideoDetail()
    }
  }, [videoId])

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }

  // 格式化时间
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return '刚刚'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
    return `${Math.floor(diffInSeconds / 86400)}天前`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">加载中...</p>
        </div>
      </div>
    )
  }

  if (!videoDetail) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 text-lg">视频不存在</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* 左侧 Logo 和菜单 */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">夜色视频</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">高品质视频平台</p>
                </div>
              </div>
            </div>

            {/* 中间搜索按钮 - 桌面端 */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <button
                onClick={() => {
                  console.log('搜索按钮被点击，设置 isSearchOpen 为 true')
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
      <div className="max-w-7xl mx-auto lg:px-4 xl:px-6 2xl:px-8 py-0 lg:py-6">
        <div className="flex gap-0 lg:gap-8">
          {/* 左侧分类导航 - 桌面端 */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
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
                        console.log('WatchPage 桌面端分类按钮:', category.name, category.id)
                        if (category.id === 'home') {
                          // 点击首页，导航到首页
                          navigate('/')
                        } else {
                          // 点击其他分类，导航到对应分类页面
                          navigate(`/category/${category.id}`)
                        }
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left ${
                        selectedCategory === category.id
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className={`w-5 h-5 ${
                          selectedCategory === category.id ? 'text-white' : 'text-purple-600 dark:text-purple-400'
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
            {/* VIP福利宣传横幅 - 条件显示和动画 */}
            {showVipBanner && (
              <div className={`relative bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 mt-4 mx-4 lg:mx-0 shadow-xl transform transition-all duration-500 ease-out ${
                vipBannerVisible 
                  ? 'translate-y-0 opacity-100' 
                  : '-translate-y-full opacity-0'
              }`}>
                {/* 关闭按钮 */}
                <button
                  onClick={closeVipBanner}
                  className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* 精简的标题和内容 */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-yellow-900" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">VIP专享福利</h2>
                    <p className="text-sm text-white/80">观看全站完整视频，享受高清无广告体验</p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center justify-center gap-3">
                  <button 
                    onClick={() => {
                      navigate('/vip')
                      closeVipBanner()
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>立即开通VIP</span>
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/invite')
                      closeVipBanner()
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-colors border border-white/30 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>邀请3人免费</span>
                  </button>
                </div>
              </div>
            )}

            {/* 视频播放器区域 */}
            <div className="bg-white dark:bg-slate-800 lg:rounded-2xl overflow-hidden shadow-lg mb-6">
              {/* 免费试看提示 */}
              <div className="bg-slate-900 text-white p-3 text-center">
                <h2 className="text-lg font-bold">
                  完整长度【 {videoDetail.duration} 】- 免费看精彩 10 秒
                </h2>
              </div>
              
              {/* 播放器 */}
              <div className="relative aspect-video bg-black">
                <video
                  className="w-full h-full"
                  poster={videoDetail.thumbnail}
                  controls
                  preload="metadata"
                >
                  <source src={videoDetail.videoUrl} type="video/mp4" />
                  您的浏览器不支持视频播放
                </video>
              </div>

              {/* 视频信息 */}
              <div className="p-4 lg:p-6">
                {/* 标题 */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {videoDetail.title}{' '}
                    <span className="text-sm text-red-500 dark:text-red-400 font-normal">
                      （请勿轻信视频里的广告和网址！）
                    </span>
                  </h1>
                </div>

                {/* 统计信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{formatNumber(videoDetail.viewCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{formatNumber(videoDetail.likeCount)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{videoDetail.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTimeAgo(videoDetail.createdAt)}</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="space-y-3 mb-6">
                  {/* 主要操作按钮 - 一行显示 */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>收藏</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Coins className="w-4 h-4" />
                      <span>打赏</span>
                    </button>
                    <button 
                      onClick={() => navigate('/vip')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>升级VIP</span>
                    </button>
                  </div>
                  
                  {/* VIP购买公告 - 复用首页组件 */}
                  <VipAnnouncements />
                </div>

                {/* 演员和标签 */}
                <div className="space-y-4">
                  {/* 演员 */}
                  {videoDetail.actors.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-500 dark:text-slate-400">主演:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {videoDetail.actors.map((actor, index) => (
                          <button
                            key={index}
                            onClick={() => navigate(`/videos?actor=${encodeURIComponent(actor)}`)}
                            className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                          >
                            {actor}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 标签 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm text-slate-500 dark:text-slate-400">标签:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {videoDetail.tags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => navigate(`/videos?tag=${encodeURIComponent(tag)}`)}
                          className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* 相关推荐 */}
            <div className="mb-6 px-4 lg:px-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  相关推荐
                </h2>
                <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">
                  基于 "#{videoDetail.tags[0]}" 标签推荐
                </p>
              </div>
              
              {/* 每行两个视频的布局 */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {relatedVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    size="small"
                  />
                ))}
              </div>
            </div>
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
          console.log('WatchPage: 分类选择:', categoryId)
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

      {/* 页脚 */}
      <Footer />

      {/* 全屏搜索 */}
      <FullScreenSearch
        isOpen={isSearchOpen}
        onClose={() => {
          console.log('关闭全屏搜索，设置 isSearchOpen 为 false')
          setIsSearchOpen(false)
        }}
        onSearch={(query) => {
          console.log('执行搜索:', query)
          navigate(`/search?q=${encodeURIComponent(query)}`)
        }}
        initialQuery={searchQuery}
      />


    </div>
  )
}
