import { useNavigate } from 'react-router-dom'
import { Layout } from './Layout'
import { useCategories } from '@/hooks/useCategories'

interface PageLayoutProps {
  children: React.ReactNode
  selectedCategory?: string
  showFooter?: boolean
  className?: string
}

export const PageLayout = ({ 
  children, 
  selectedCategory = '',
  showFooter = true,
  className = ''
}: PageLayoutProps) => {
  const navigate = useNavigate()
  
  // 获取分类数据
  const { categories } = useCategories()

  return (
    <Layout showFooter={showFooter} className={className}>
      {/* 主要内容区域 - 左右布局 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6 items-start">
          {/* 左侧分类导航 */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
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
                        console.log('PageLayout 桌面端分类按钮:', category.name, category.id)
                        if (category.id === 'home') {
                          // 点击首页，导航到首页
                          navigate('/')
                        } else {
                          // 点击其他分类，导航到分类页面
                          navigate(`/category/${category.id}`)
                        }
                      }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200
                        ${selectedCategory === category.id 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon className={`w-5 h-5 ${
                          selectedCategory === category.id 
                            ? 'text-white' 
                            : 'text-slate-600 dark:text-slate-400'
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
            {children}
          </main>
        </div>
      </div>
    </Layout>
  )
}
