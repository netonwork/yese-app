import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { VideoGrid } from '@/components/VideoGrid'
import { Pagination } from '@/components/Pagination'

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
  thumbnail: `https://api.yviii.com/img/meitu?${i + 1}`,
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
  const [searchParams] = useSearchParams()
  
  // 获取URL参数
  const categoryId = searchParams.get('category')
  const tagName = searchParams.get('tag')
  const actorName = searchParams.get('actor')
  
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
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

  // 获取当前页的视频
  const getCurrentPageVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return videos.slice(startIndex, endIndex)
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
      
      // 根据演员过滤
      if (actorName) {
        filteredVideos = filteredVideos.filter(video => 
          video.actors.some(actor => actor.includes(actorName))
        )
      }
      
      // 根据标签过滤
      if (tagName) {
        filteredVideos = filteredVideos.filter(video => 
          video.tags.some(tag => tag.includes(tagName))
        )
      }
      
      setVideos(filteredVideos)
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [categoryId, tagName, actorName])

  return (
    <Layout showCategorySidebar={true}>
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
        gridCols="grid-cols-1 lg:grid-cols-3"
        size="medium"
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