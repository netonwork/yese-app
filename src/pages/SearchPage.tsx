import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  ArrowLeft, 
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react'
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
}

interface SearchResult {
  videos: Video[]
  actors: string[]
  tags: string[]
  total: number
}

// 模拟搜索数据
const mockSearchData: Video[] = Array.from({ length: 100 }, (_, i) => ({
  id: `search-${i + 1}`,
  title: `搜索结果视频 ${i + 1} - 包含关键词的精彩内容`,
  thumbnail: `https://picsum.photos/400/225?random=${i + 600}`,
  duration: `00:${String(Math.floor(Math.random() * 60) + 10).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  viewCount: Math.floor(Math.random() * 100000) + 1000,
  category: ['动作片', '爱情片', '喜剧片', '惊悚片', '科幻片'][Math.floor(Math.random() * 5)],
  actors: [`演员${i + 1}`, `明星${i + 1}`],
  tags: ['高清', '热门', '推荐', '经典', '新片'].slice(0, Math.floor(Math.random() * 3) + 1),
  createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
}))

// 热门搜索关键词
const hotKeywords = ['动作', '爱情', '喜剧', '科幻', '惊悚', '经典', '新片', '高清']

export const SearchPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const keyword = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(keyword)
  const [searchResult, setSearchResult] = useState<SearchResult>({
    videos: [],
    actors: [],
    tags: [],
    total: 0
  })
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  
  const videosPerPage = 20
  const totalPages = Math.ceil(searchResult.total / videosPerPage)



  // 执行搜索
  const performSearch = (query: string) => {
    if (!query.trim()) return
    
    setLoading(true)
    setCurrentPage(1)
    
    // 更新URL
    const newParams = new URLSearchParams()
    newParams.set('q', query)
    setSearchParams(newParams)
    
    // 添加到搜索历史
    const newRecentSearches = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
    
    // 模拟搜索API
    setTimeout(() => {
      // 为了演示分页效果，让搜索结果更容易匹配
      const filteredVideos = mockSearchData.filter(video => 
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.actors.some(actor => actor.toLowerCase().includes(query.toLowerCase())) ||
        video.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        video.category.toLowerCase().includes(query.toLowerCase()) ||
        // 增加更宽松的匹配条件
        query.length <= 2 // 如果搜索词很短，返回更多结果
      )
      
      const actors = Array.from(new Set(
        mockSearchData.flatMap(video => video.actors)
          .filter(actor => actor.toLowerCase().includes(query.toLowerCase()))
      )).slice(0, 10)
      
      const tags = Array.from(new Set(
        mockSearchData.flatMap(video => video.tags)
          .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )).slice(0, 10)
      
      setSearchResult({
        videos: filteredVideos,
        actors,
        tags,
        total: filteredVideos.length
      })
      setLoading(false)
    }, 500)
  }

  // 处理搜索提交
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      performSearch(searchInput.trim())
    }
  }

  // 清除搜索历史
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  // 初始化
  useEffect(() => {
    // 加载搜索历史
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
    
    // 如果有搜索关键词，执行搜索
    if (keyword) {
      setSearchInput(keyword)
      performSearch(keyword)
    }
  }, [])

  const getCurrentPageVideos = () => {
    const startIndex = (currentPage - 1) * videosPerPage
    const endIndex = startIndex + videosPerPage
    return searchResult.videos.slice(startIndex, endIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="搜索视频、演员、标签..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!keyword ? (
          /* 搜索首页 */
          <div className="space-y-8">
            {/* 热门搜索 */}
            <section>
              <h2 className="text-xl font-bold text-white mb-4">热门搜索</h2>
              <div className="flex flex-wrap gap-3">
                {hotKeywords.map((word) => (
                  <button
                    key={word}
                    onClick={() => {
                      setSearchInput(word)
                      performSearch(word)
                    }}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </section>

            {/* 搜索历史 */}
            {recentSearches.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">搜索历史</h2>
                  <button
                    onClick={clearRecentSearches}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    清除
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchInput(search)
                        performSearch(search)
                      }}
                      className="px-4 py-2 bg-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* 搜索结果 */
          <div className="space-y-8">
            {/* 搜索结果标题和描述 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl md:text-2xl font-bold text-white">
                  <span className="md:hidden">"{keyword}" 搜索结果</span>
                  <span className="hidden md:inline">搜索结果: "{keyword}"</span>
                </h2>
                <p className="text-sm md:text-base text-slate-300">
                  <span className="md:hidden">找到 {searchResult.total} 个视频</span>
                  <span className="hidden md:inline">为您找到 {searchResult.total} 个相关视频，发现更多精彩内容</span>
                </p>
              </div>
            </div>

            {/* 相关标签和演员 */}
            {(searchResult.actors.length > 0 || searchResult.tags.length > 0) && (
              <div className="space-y-4">
                {searchResult.actors.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">相关演员</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.actors.map((actor) => (
                        <button
                          key={actor}
                          onClick={() => {
                            setSearchInput(actor)
                            performSearch(actor)
                          }}
                          className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-lg hover:bg-purple-600/30 transition-colors text-sm"
                        >
                          {actor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchResult.tags.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">相关标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {searchResult.tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => {
                            setSearchInput(tag)
                            performSearch(tag)
                          }}
                          className="px-3 py-1 bg-pink-600/20 text-pink-300 rounded-lg hover:bg-pink-600/30 transition-colors text-sm"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {searchResult.videos.length > 0 ? (
              <>
                {/* 视频网格 */}
                <VideoGrid
                  videos={getCurrentPageVideos()}
                  loading={loading}
                />

                {/* 分页组件 */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            ) : loading ? (
              <VideoGrid videos={[]} loading={true} />
            ) : (
              /* 无搜索结果 */
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-white mb-2">没有找到相关内容</h3>
                <p className="text-slate-400 mb-6">试试其他关键词或浏览热门内容</p>
                <div className="flex flex-wrap justify-center gap-3">
                  {hotKeywords.slice(0, 4).map((word) => (
                    <button
                      key={word}
                      onClick={() => {
                        setSearchInput(word)
                        performSearch(word)
                      }}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
