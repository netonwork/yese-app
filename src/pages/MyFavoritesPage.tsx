import { useState, useEffect, useMemo } from 'react'
import { Heart } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { VideoGrid } from '@/components/VideoGrid'
import { Pagination } from '@/components/Pagination'

// 模拟收藏视频数据
const generateMockFavorites = (count: number = 20) => {
  const categories = ['动作片', '爱情片', '喜剧片', '科幻片', '恐怖片']
  const actors = ['演员1', '演员2', '演员3', '演员4', '演员5']
  
  return Array.from({ length: count }, (_, i) => {
    const badgeTypes: ('hot' | 'exclusive')[] = ['hot', 'exclusive']
    const randomBadge = Math.random() < 0.4 ? badgeTypes[Math.floor(Math.random() * badgeTypes.length)] : undefined
    
    return {
      id: `favorite-${i + 1}`,
      title: `我收藏的精彩视频 ${i + 1} - 这是一个很长的标题用来测试显示效果`,
      thumbnail: `https://api.yviii.com/img/meitu?${i + 100}`,
      duration: `00:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      viewCount: Math.floor(Math.random() * 100000) + 1000,
      rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
      category: categories[Math.floor(Math.random() * categories.length)] || '动作片',
      actors: Math.random() > 0.3 ? [`演员${i + 1}`, `演员${i + 2}`] : [], // 30%的视频没有演员信息
      tags: ['高清', '热门', '推荐'].slice(0, Math.floor(Math.random() * 3) + 1),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      favoriteTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ...(randomBadge && { badge: randomBadge })
    }
  })
}

export const MyFavoritesPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const videosPerPage = 12 // 手机2列，PC3列，每页12个
  const totalVideos = 48 // 模拟总数
  const totalPages = Math.ceil(totalVideos / videosPerPage)

  // 生成模拟收藏视频数据
  const mockFavoriteVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * videosPerPage
    return generateMockFavorites(videosPerPage).map((video, index) => ({
      ...video,
      id: `favorite-${startIndex + index + 1}`,
    }))
  }, [currentPage, videosPerPage])

  const [videos, setVideos] = useState(mockFavoriteVideos)

  // 模拟数据加载
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setVideos(mockFavoriteVideos)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [mockFavoriteVideos])

  return (
    <Layout showCategorySidebar={true}>
      {/* 页面标题 */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100">
            我的收藏
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
            个人收藏合集
          </p>
        </div>
      </div>

      {/* 视频网格 */}
      <VideoGrid
        videos={videos}
        loading={loading}
        gridCols="grid-cols-2 lg:grid-cols-3"
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