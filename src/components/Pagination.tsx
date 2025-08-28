import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
  if (totalPages <= 1) return null

  const getVisiblePages = () => {
    const maxVisible = 5
    const half = Math.floor(maxVisible / 2)
    
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    // 调整起始位置，确保显示足够的页码
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()

  return (
    <div className={`flex justify-center items-center gap-2 mt-12 ${className}`}>
      {/* 上一页按钮 */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="p-2 rounded-lg bg-slate-800 dark:bg-slate-800 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="上一页"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {/* 页码按钮 */}
      {visiblePages.map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === pageNum
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-800 dark:bg-slate-800 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-700'
          }`}
          aria-label={`第${pageNum}页`}
          aria-current={currentPage === pageNum ? 'page' : undefined}
        >
          {pageNum}
        </button>
      ))}
      
      {/* 下一页按钮 */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg bg-slate-800 dark:bg-slate-800 text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="下一页"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
