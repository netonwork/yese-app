import { VideoCard } from './VideoCard'

interface Video {
  id: string
  title: string
  thumbnail: string
  duration: string
  viewCount: number
  actors: string[]
  createdAt: string
}

interface VideoGridProps {
  videos: Video[]
  loading?: boolean
  onVideoClick?: (video: Video) => void
  className?: string
}

export const VideoGrid = ({ videos, loading = false, onVideoClick, className = '' }: VideoGridProps) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl mb-4"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-4/5"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          {...(onVideoClick && { onClick: () => onVideoClick(video) })}
        />
      ))}
    </div>
  )
}
