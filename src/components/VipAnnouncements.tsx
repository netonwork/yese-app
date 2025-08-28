import { useState, useEffect } from 'react'
import { Crown, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// 模拟VIP购买公告数据
const mockAnnouncements = [
  { id: 1, username: '小明', days: 199, plan: '月卡' },
  { id: 2, username: '张三', days: 365, plan: '年卡' },
  { id: 3, username: '李四', days: 88, plan: '季卡' },
  { id: 4, username: '王五', days: 156, plan: '月卡' },
  { id: 5, username: '赵六', days: 299, plan: '年卡' },
  { id: 6, username: '孙七', days: 45, plan: '月卡' },
  { id: 7, username: '周八', days: 678, plan: '年卡' },
  { id: 8, username: '吴九', days: 123, plan: '季卡' },
]

export const VipAnnouncements = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % mockAnnouncements.length)
        setIsVisible(true)
      }, 200) // 淡出动画时间
    }, 3000) // 3秒切换

    return () => clearInterval(interval)
  }, [])

  const currentAnnouncement = mockAnnouncements[currentIndex]



  const handleClick = () => {
    navigate('/vip')
  }

  return (
    <div 
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg lg:rounded-xl border border-purple-200/50 dark:border-purple-700/50 cursor-pointer hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-all duration-300 hover:shadow-md hover:border-purple-300/60 dark:hover:border-purple-600/60"
    >
      <div className="flex items-center gap-1 lg:gap-2 text-purple-600 dark:text-purple-400">
        <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
        <Users className="w-3 h-3 lg:w-4 lg:h-4 hidden sm:block" />
      </div>
      
      <div className={`flex-1 text-xs lg:text-sm transition-opacity duration-200 min-w-0 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-purple-600 dark:text-purple-400">
          注册 <span className="font-medium">{currentAnnouncement.days}</span> 天的老VIP{' '}
          <span className="font-medium">{currentAnnouncement.username}</span>{' '}
          刚刚购买了
          <span className="font-bold ml-1">
            【{currentAnnouncement.plan}】
          </span>
        </span>
      </div>
      
      {/* 动画指示器 - 移动端隐藏部分 */}
      <div className="flex gap-1">
        {mockAnnouncements.slice(0, 4).map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex % 4
                ? 'bg-purple-500 dark:bg-purple-400' 
                : 'bg-purple-200 dark:bg-purple-700'
            }`}
          />
        ))}
        {/* 桌面端显示所有指示器 */}
        <div className="hidden lg:flex gap-1">
          {mockAnnouncements.slice(4).map((_, index) => (
            <div
              key={index + 4}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index + 4 === currentIndex 
                  ? 'bg-purple-500 dark:bg-purple-400' 
                  : 'bg-purple-200 dark:bg-purple-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
