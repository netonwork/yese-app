import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { PageLayout } from '@/components/PageLayout'
import { VideoCard } from '@/components/VideoCard'
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
        videos: Array.from({ length: 6 }, (_, i) => ({
          id: `kungfu-${i + 1}`,
          title: `功夫动作片 ${i + 1} - 精彩武打场面`,
          thumbnail: `https://api.yviii.com/img/meitu?${i + 100}`,
          duration: `01:${String(Math.floor(Math.random() * 60) + 30).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          viewCount: Math.floor(Math.random() * 100000) + 10000,
          category: '动作片',
          actors: [`功夫演员${i + 1}`, `武打明星${i + 1}`],
          tags: ['功夫', '武打', '动作'],
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          ...(Math.random() > 0.5 && { badge: 'hot' as const })
        }))
      },
      {
        id: 'racing',
        name: '赛车',
        count: 89,
        videos: Array.from({ length: 6 }, (_, i) => ({
          id: `racing-${i + 1}`,
          title: `极速赛车 ${i + 1} - 速度与激情`,
          thumbnail: `https://api.yviii.com/img/meitu?${i + 200}`,
          duration: `01:${String(Math.floor(Math.random() * 60) + 20).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          viewCount: Math.floor(Math.random() * 80000) + 5000,
          category: '动作片',
          actors: [`赛车手${i + 1}`, `飞车演员${i + 1}`],
          tags: ['赛车', '速度', '刺激'],
          createdAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
          ...(Math.random() > 0.6 && { badge: 'exclusive' as const })
        }))
      }
    ]
  },
  {
    id: 'romance',
    name: '爱情片',
    tags: [
      {
        id: 'sweet',
        name: '甜蜜',
        count: 234,
        videos: Array.from({ length: 6 }, (_, i) => ({
          id: `sweet-${i + 1}`,
          title: `甜蜜爱情 ${i + 1} - 浪漫温馨故事`,
          thumbnail: `https://api.yviii.com/img/meitu?${i + 300}`,
          duration: `01:${String(Math.floor(Math.random() * 60) + 15).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
          viewCount: Math.floor(Math.random() * 120000) + 8000,
          category: '爱情片',
          actors: [`甜美女主${i + 1}`, `温柔男主${i + 1}`],
          tags: ['甜蜜', '浪漫', '温馨'],
          createdAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
          ...(Math.random() > 0.4 && { badge: 'hot' as const })
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
  
  // 获取分类数据
  const { categories } = useCategories()

  // 根据categoryId获取分类信息
  const getCategoryInfo = (id: string) => {
    const apiCategory = categories.find(cat => cat.id === id)
    if (apiCategory) {
      return {
        name: apiCategory.name,
        description: `发现更多${apiCategory.name}相关的精彩内容`
      }
    }
    
    // 如果API中没有找到，使用默认映射
    const categoryNames: { [key: string]: string } = {
      'action': '动作片',
      'romance': '爱情片',
      'comedy': '喜剧片',
      'thriller': '惊悚片',
      'scifi': '科幻片'
    }
    
    const name = categoryNames[id] || id
    return {
      name,
      description: `发现更多${name}相关的精彩内容`
    }
  }

  useEffect(() => {
    if (categoryId) {
      setLoading(true)
      // 模拟API调用
      const timer = setTimeout(() => {
        const foundCategory = mockCategories.find(cat => cat.id === categoryId)
        setCategory(foundCategory || null)
        setLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [categoryId])

  if (loading) {
    return (
      <PageLayout selectedCategory={categoryId}>
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-8"></div>
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j} className="aspect-video bg-slate-200 dark:bg-slate-700 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!category) {
    return (
      <PageLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            分类不存在
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            抱歉，您访问的分类页面不存在或已被删除。
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </PageLayout>
    )
  }

  const categoryInfo = getCategoryInfo(categoryId!)

  return (
    <PageLayout selectedCategory={categoryId}>
      {/* 分类标题和描述 */}
      <div className="mb-8">
        <div className="flex items-baseline gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {categoryInfo.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            分类视频合集
          </p>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          {categoryInfo.description}
        </p>
      </div>

      {/* 标签列表 */}
      <div className="space-y-8">
        {category.tags.map((tag) => (
          <div key={tag.id}>
            {/* 标签标题 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {tag.name}
                </h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-medium">
                  {tag.count} 个视频
                </span>
              </div>
              <Link
                to={`/videos?category=${categoryId}&tag=${encodeURIComponent(tag.name)}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 text-xs font-medium"
              >
                查看全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 视频网格 */}
            <div className="block md:hidden">
              {/* 移动端特殊布局：第1个视频单独一行，其他每行2个，只显示前5个 */}
              <div className="space-y-4">
                {tag.videos.slice(0, 5).map((video, index) => {
                  if (index === 0) {
                    // 第1个视频单独占一行
                    return (
                      <div key={video.id} className="w-full">
                        <VideoCard
                          video={video}
                          size="medium"
                        />
                      </div>
                    )
                  } else if (index === 1) {
                    // 第2、3个视频一行显示
                    return (
                      <div key={`row-${index}`} className="grid grid-cols-2 gap-4">
                        <VideoCard
                          video={video}
                          size="small"
                        />
                        {tag.videos[2] && (
                          <VideoCard
                            video={tag.videos[2]}
                            size="small"
                          />
                        )}
                      </div>
                    )
                  } else if (index === 3) {
                    // 第4、5个视频一行显示
                    return (
                      <div key={`row-${index}`} className="grid grid-cols-2 gap-4">
                        <VideoCard
                          video={video}
                          size="small"
                        />
                        {tag.videos[4] && (
                          <VideoCard
                            video={tag.videos[4]}
                            size="small"
                          />
                        )}
                      </div>
                    )
                  }
                  // 跳过第2、4个视频，因为它们已经在上面处理了
                  return null
                })}
              </div>
            </div>
            
            {/* 桌面端正常网格布局 */}
            <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tag.videos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  size="small"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  )
}
