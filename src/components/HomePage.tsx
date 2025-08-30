import { useState, useEffect } from 'react'
import { Layout } from './Layout'
import { useAppInit } from '@/hooks/useAppInit'
import { AppInstallBanner } from './AppInstallBanner'
import { VipAnnouncements } from './VipAnnouncements'
import { VideoGrid } from './VideoGrid'
import { Pagination } from './Pagination'

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
    thumbnail: `https://api.yviii.com/img/meitu?${i + 1}`,
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
  const [selectedCategory] = useState('home')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // 初始化应用（处理邀请码、站点配置等）
  useAppInit()
  
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
    <Layout showCategorySidebar={true} selectedCategory={selectedCategory}>
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
        size="medium"
        gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      />

      {/* 分页组件 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Layout>
  )
}