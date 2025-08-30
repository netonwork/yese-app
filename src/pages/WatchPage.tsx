import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { 
  Heart,
  Eye,
  Calendar,
  Clock,
  ShoppingCart,
  UserPlus,
  Coins,
  X,
  Crown,
  ChevronRight,
  Users,
  Tag
} from 'lucide-react'
import { Layout } from '@/components/Layout'
import { VideoCard } from '@/components/VideoCard'
import { VipAnnouncements } from '@/components/VipAnnouncements'

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
  thumbnail: 'https://api.yviii.com/img/meitu?main',
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
    thumbnail: `https://api.yviii.com/img/meitu?${i + 100}`,
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
  const [videoDetail, setVideoDetail] = useState<VideoDetail | null>(null)
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // VIP横幅显示控制
  const [showVipBanner, setShowVipBanner] = useState(false)
  const [vipBannerVisible, setVipBannerVisible] = useState(false)

  // 检测VIP状态并控制横幅显示
  useEffect(() => {
    // 模拟检测用户VIP状态
    const isVip = false // 模拟非VIP用户
    
    if (!isVip) {
      // 3秒后显示VIP横幅
      const timer = setTimeout(() => {
        setShowVipBanner(true)
        // 稍微延迟一下再显示动画
        setTimeout(() => setVipBannerVisible(true), 100)
      }, 3000)

      return () => clearTimeout(timer)
    }
    
    return undefined
  }, [])

  // 关闭VIP横幅的函数
  const closeVipBanner = () => {
    setVipBannerVisible(false)
    setTimeout(() => setShowVipBanner(false), 500) // 等待动画完成
  }

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toLocaleString()
  }

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  // 模拟数据加载
  useEffect(() => {
    if (!videoId) return

    setLoading(true)
    
    const timer = setTimeout(() => {
      setVideoDetail(mockVideoDetail)
      setRelatedVideos(generateRelatedVideos('功夫'))
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [videoId])

  // 加载状态
  if (loading) {
    return (
      <Layout showCategorySidebar={true} showFooter={false}>
        <div className="animate-pulse">
          <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-6"></div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </Layout>
    )
  }

  // 视频不存在
  if (!videoDetail) {
    return (
      <Layout showCategorySidebar={true}>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            视频不存在
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            抱歉，您访问的视频不存在或已被删除。
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showCategorySidebar={true} showFooter={false}>
      {/* VIP福利宣传横幅 - 条件显示和动画 */}
      {showVipBanner && (
        <div className={`relative bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-4 mb-6 shadow-xl transform transition-all duration-500 ease-out ${
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
                  navigate('/share')
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
                <Clock className="w-4 h-4" />
                <span>{videoDetail.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(videoDetail.releaseDate)}</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3 mb-4">
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
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Crown className="w-4 h-4" />
                <span>升级VIP</span>
              </button>
            </div>

            {/* 演员和标签信息 */}
            <div className="space-y-3 mb-6">
              {/* 演员列表 */}
              {videoDetail.actors.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 min-w-0 flex-shrink-0">
                    <Users className="w-4 h-4" />
                    <span className="font-medium">演员</span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {videoDetail.actors.map((actor, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/videos?actor=${encodeURIComponent(actor)}`)}
                        className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        {actor}{index < videoDetail.actors.length - 1 && '、'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 标签列表 */}
              {videoDetail.tags.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 min-w-0 flex-shrink-0">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">标签</span>
                  </div>
                  <div className="flex flex-wrap gap-1 min-w-0">
                    {videoDetail.tags.map((tag, index) => (
                      <button
                        key={index}
                        onClick={() => navigate(`/videos?tag=${encodeURIComponent(tag)}`)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                      >
                        #{tag}{index < videoDetail.tags.length - 1 && '、'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* VIP购买公告 */}
      <VipAnnouncements />

      {/* 相关推荐 */}
      <div className="mt-8">
        {videoDetail.tags.length > 0 ? (
          <div>
            {/* 标签标题 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {videoDetail.tags[0]}推荐
                </h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  {relatedVideos.length} 个视频
                </span>
              </div>
              <Link
                to={`/videos?tag=${encodeURIComponent(videoDetail.tags[0] || '')}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-xs font-medium"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 视频网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {relatedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  size="small"
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* 分类推荐 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  更多{videoDetail.category}推荐
                </h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  {relatedVideos.length} 个视频
                </span>
              </div>
              <Link
                to={`/videos?category=${encodeURIComponent(videoDetail.category)}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-xs font-medium"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 视频网格 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              {relatedVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}