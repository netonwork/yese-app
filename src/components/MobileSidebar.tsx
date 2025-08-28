import { X, Search } from 'lucide-react'
import { useEffect } from 'react'
import type { Category } from '@/hooks/useCategories'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  selectedCategory: string
  onCategorySelect: (categoryId: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearchClick?: () => void
}

export const MobileSidebar = ({
  isOpen,
  onClose,
  categories,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  onSearchClick
}: MobileSidebarProps) => {
  console.log('MobileSidebar 接收到的分类数据:', categories)
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

  // 点击背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />
      
      {/* 侧边栏 */}
      <div className={`
        absolute left-0 top-0 h-full w-80 max-w-[85vw]
        bg-white dark:bg-slate-900
        border-r border-slate-200 dark:border-slate-700
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            夜色视频
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 搜索按钮 */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              onSearchClick?.()
              onClose()
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 text-left"
          >
            <Search className="w-5 h-5 text-slate-400" />
            <span className="text-slate-500 dark:text-slate-400">搜索视频、演员、标签...</span>
          </button>
        </div>

        {/* 分类列表 - 可滚动 */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent"
             style={{ 
               height: 'calc(100vh - 160px)', // 减去头部和搜索框的高度
               overscrollBehavior: 'contain', // 防止滚动穿透
               WebkitOverflowScrolling: 'touch' // iOS 平滑滚动
             }}>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onCategorySelect(category.id)
                onClose()
              }}
              className={`
                w-full flex items-center justify-between px-4 py-4 rounded-xl text-left transition-all duration-200
                ${selectedCategory === category.id 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <category.icon className={`w-6 h-6 ${
                  selectedCategory === category.id 
                    ? 'text-white' 
                    : 'text-slate-600 dark:text-slate-400'
                }`} />
                <span className="font-medium text-lg">{category.name}</span>
              </div>
              {category.id !== 'home' && (
                <span className={`text-sm ${
                  selectedCategory === category.id 
                    ? 'text-white/80' 
                    : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {category.videoCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
