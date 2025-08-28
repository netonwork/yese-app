import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Search, Clock, TrendingUp } from 'lucide-react'

interface FullScreenSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (query: string) => void
  initialQuery?: string
}

// 模拟热门搜索关键词
const hotKeywords = [
  '动作片', '爱情片', '喜剧片', '科幻片', '惊悚片',
  '功夫', '武打', '浪漫', '搞笑', '悬疑'
]



export const FullScreenSearch = ({
  isOpen,
  onClose,
  onSearch,
  initialQuery = ''
}: FullScreenSearchProps) => {
  const [query, setQuery] = useState(initialQuery)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // 从localStorage加载最近搜索
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('recentSearches')
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved))
        } catch {
          setRecentSearches([])
        }
      }
      
      // 自动聚焦输入框
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // 保存到最近搜索
    const newRecentSearches = [
      searchQuery.trim(),
      ...recentSearches.filter(item => item !== searchQuery.trim())
    ].slice(0, 10) // 最多保存10个

    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))

    // 执行搜索
    onSearch(searchQuery.trim())
    onClose()
  }

  const handleKeywordClick = (keyword: string) => {
    setQuery(keyword)
    handleSearch(keyword)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  const removeRecentSearch = (index: number) => {
    const newRecentSearches = recentSearches.filter((_, i) => i !== index)
    setRecentSearches(newRecentSearches)
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))
  }

  if (!isOpen) {
    console.log('FullScreenSearch: isOpen 为 false，不渲染组件')
    return null
  }

  console.log('FullScreenSearch: isOpen 为 true，正在渲染组件')
  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-slate-900">
      {/* 顶部搜索栏 */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
          </button>
          
          <form
            className="flex-1 flex gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              handleSearch(query)
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                placeholder="搜索视频、演员、标签..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={!query.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              搜索
            </button>
          </form>
        </div>
      </div>

      {/* 搜索内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8">
        {/* 最近搜索 */}
        {recentSearches.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  最近搜索
                </h3>
              </div>
              <button
                onClick={clearRecentSearches}
                className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              >
                清空
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((item, index) => (
                <div key={index} className="relative group">
                  <button
                    onClick={() => handleKeywordClick(item)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-full transition-colors text-sm font-medium pr-8"
                  >
                    {item}
                  </button>
                  <button
                    onClick={() => removeRecentSearch(index)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-slate-300 dark:bg-slate-600 hover:bg-red-400 dark:hover:bg-red-500 text-slate-600 dark:text-slate-300 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 热门搜索 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              热门搜索
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {hotKeywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(keyword)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-full transition-colors text-sm font-medium"
              >
                {keyword}
              </button>
            ))}
          </div>
        </section>




      </div>
    </div>,
    document.body
  )
}
