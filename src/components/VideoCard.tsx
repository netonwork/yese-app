import { Play, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  viewCount: number
  actors: string[]
  createdAt: string
  badge?: 'hot' | 'exclusive'
}

interface VideoCardProps {
  video: Video
  onClick?: () => void
  size?: 'small' | 'medium' | 'large'
}

// 角标配置
const getBadgeConfig = (badge: string) => {
  const configs = {
    hot: {
      text: '热门推荐',
      className: 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
    },
    exclusive: {
      text: '独家首发',
      className: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
    }
  }
  return configs[badge as keyof typeof configs] || null
}

export const VideoCard = ({ video, onClick, size = 'medium' }: VideoCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // 默认跳转到视频详情页
      navigate(`/watch/${video.id}`)
    }
  }
  const formatViewCount = (count: number) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`
    }
    return count.toLocaleString()
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return '刚刚'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes}分钟前`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours}小时前`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days}天前`
    }
  }

  // 根据size获取样式类
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return {
          container: 'mb-3',
          aspectRatio: 'aspect-[4/3]', // 4:3 比例
          playButton: 'w-12 h-12',
          playIcon: 'w-6 h-6',
          duration: 'bottom-2 right-2 px-1.5 py-0.5 text-xs',
          title: 'text-sm leading-5 mb-2 md:min-h-[2.5rem]',
          meta: 'text-xs'
        }
      case 'large':
        return {
          container: 'mb-5',
          aspectRatio: 'aspect-video', // 16:9 比例
          playButton: 'w-20 h-20',
          playIcon: 'w-10 h-10',
          duration: 'bottom-4 right-4 px-3 py-1.5 text-base',
          title: 'text-xl leading-7 mb-4 md:min-h-[3.5rem]',
          meta: 'text-base'
        }
      default: // medium
        return {
          container: 'mb-4',
          aspectRatio: 'aspect-video', // 16:9 比例
          playButton: 'w-16 h-16',
          playIcon: 'w-8 h-8',
          duration: 'bottom-3 right-3 px-2 py-1 text-sm',
          title: 'text-lg leading-6 mb-3 md:min-h-[3rem]',
          meta: 'text-sm'
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div
      className="group cursor-pointer transition-all duration-300 hover:scale-105"
      onClick={handleClick}
    >
      {/* 视频缩略图 */}
      <div className={`relative overflow-hidden rounded-xl ${sizeClasses.aspectRatio} ${sizeClasses.container} bg-slate-200 dark:bg-slate-700`}>
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* 播放按钮覆盖层 */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className={`${sizeClasses.playButton} bg-white/90 rounded-full flex items-center justify-center`}>
            <Play className={`${sizeClasses.playIcon} text-slate-800 ml-1`} fill="currentColor" />
          </div>
        </div>
        
        {/* 时长标签 */}
        <div className={`absolute ${sizeClasses.duration} bg-black/70 text-white rounded-md`}>
          {video.duration}
        </div>
        
        {/* 角标 */}
        {video.badge && (() => {
          const badgeConfig = getBadgeConfig(video.badge)
          if (!badgeConfig) return null
          
          return (
            <div className="absolute top-2 right-2">
              <div
                className={`
                  font-medium rounded-md shadow-sm
                  ${badgeConfig.className}
                  ${size === 'small' 
                    ? 'text-xs px-1.5 py-0.5' 
                    : size === 'large'
                    ? 'text-sm px-3 py-1.5'
                    : 'text-xs px-2 py-1'
                  }
                `}
              >
                {badgeConfig.text}
              </div>
            </div>
          )
        })()}
      </div>
      
      {/* 视频信息 */}
      <div>
        {/* 标题 - 移动端动态高度，桌面端固定两行 */}
        <h4 className={`font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 ${sizeClasses.title} group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors`}>
          {video.title}
        </h4>
        
        {/* 播放次数、演员、发布时间 */}
        <div className={`flex items-center ${sizeClasses.meta} text-slate-500 dark:text-slate-400`}>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Eye className={`${size === 'small' ? 'w-3 h-3' : 'w-4 h-4'}`} />
            <span>{formatViewCount(video.viewCount)}</span>
          </div>
          {video.actors && video.actors.length > 0 && (
            <>
              <span className="mx-2 flex-shrink-0">•</span>
              <button
                onClick={(e) => {
                  e.stopPropagation() // 阻止事件冒泡到父级的onClick
                  navigate(`/videos?actor=${encodeURIComponent(video.actors[0])}`)
                }}
                className="truncate px-1 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer underline-offset-2 hover:underline"
              >
                {video.actors[0]}
              </button>
            </>
          )}
          <span className="mx-2 flex-shrink-0">•</span>
          <span className="flex-shrink-0">{formatTimeAgo(video.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
