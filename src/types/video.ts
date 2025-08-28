import * as v from 'valibot'
import { ID, Timestamp, URL } from './common'

// 视频质量选项
export const VideoQuality = v.object({
  quality: v.string(), // "720p", "1080p", "4K"
  url: URL,
  bandwidth: v.number([v.minValue(0)]),
  resolution: v.optional(v.string()), // "1920x1080"
  fileSize: v.optional(v.number([v.minValue(0)])) // bytes
})

// 分类
export const Category = v.object({
  id: ID,
  name: v.string([v.minLength(1), v.maxLength(50)]),
  slug: v.string([v.minLength(1)]),
  description: v.optional(v.string([v.maxLength(500)])),
  icon: v.optional(v.string()),
  thumbnail: v.optional(URL),
  videoCount: v.number([v.minValue(0)]),
  order: v.number([v.minValue(0)]),
  isActive: v.boolean(),
  parentId: v.optional(ID), // 支持二级分类
  createdAt: Timestamp,
  updatedAt: Timestamp
})

// 标签
export const Tag = v.object({
  id: ID,
  name: v.string([v.minLength(1), v.maxLength(30)]),
  slug: v.string([v.minLength(1)]),
  color: v.optional(v.string()), // 十六进制颜色
  description: v.optional(v.string([v.maxLength(200)])),
  videoCount: v.number([v.minValue(0)]),
  isHot: v.boolean(),
  categoryId: v.optional(ID), // 标签可以关联到特定分类
  createdAt: Timestamp,
  updatedAt: Timestamp
})

// 视频基础信息
export const Video = v.object({
  id: ID,
  title: v.string([v.minLength(1), v.maxLength(200)]),
  description: v.string([v.maxLength(2000)]),
  thumbnail: URL,
  streamUrl: URL, // 主要的m3u8播放地址
  duration: v.string(), // "01:23:45" 格式
  durationSeconds: v.number([v.minValue(0)]), // 总秒数
  viewCount: v.number([v.minValue(0)]),
  likeCount: v.number([v.minValue(0)]),
  favoriteCount: v.number([v.minValue(0)]),
  commentCount: v.number([v.minValue(0)]),
  
  // VIP相关
  isVip: v.boolean(),
  vipLevel: v.optional(v.number([v.minValue(1), v.maxValue(10)])),
  
  // 分类和标签关联
  categoryId: ID,
  categoryName: v.string(),
  tags: v.array(ID), // 标签ID数组
  tagNames: v.array(v.string()), // 标签名称数组（用于显示）
  
  // 演员关联
  actors: v.array(ID), // 演员ID数组
  actorNames: v.array(v.string()), // 演员名称数组（用于显示）
  
  // 视频元数据
  resolution: v.optional(v.string()), // "1920x1080"
  fileSize: v.optional(v.number([v.minValue(0)])), // bytes
  codec: v.optional(v.string()), // "H.264", "H.265"
  bitrate: v.optional(v.number([v.minValue(0)])), // kbps
  frameRate: v.optional(v.number([v.minValue(0)])), // fps
  
  // 发布信息
  releaseDate: v.optional(v.string()), // YYYY-MM-DD
  studio: v.optional(v.string([v.maxLength(100)])), // 制作公司
  series: v.optional(v.string([v.maxLength(100)])), // 系列名称
  director: v.optional(v.string([v.maxLength(50)])), // 导演
  
  // 状态
  status: v.union([
    v.literal('published'),
    v.literal('draft'),
    v.literal('processing'),
    v.literal('deleted')
  ]),
  isActive: v.boolean(),
  
  // 时间戳
  createdAt: Timestamp,
  updatedAt: Timestamp,
  publishedAt: v.optional(Timestamp),
  
  // HLS多码率支持
  qualities: v.optional(v.array(VideoQuality)),
  
  // 预览图片
  previews: v.optional(v.array(URL)), // 预览截图
  
  // 评分
  rating: v.optional(v.number([v.minValue(0), v.maxValue(5)])),
  ratingCount: v.optional(v.number([v.minValue(0)]))
})

// 视频详情（包含完整信息）
export const VideoDetail = v.object({
  ...Video.entries,
  // 完整的关联对象
  category: Category,
  tagList: v.array(Tag),
  actorList: v.array(v.object({
    id: ID,
    name: v.string(),
    avatar: v.optional(URL),
    slug: v.string()
  })),
  
  // 用户交互状态（需要登录）
  userInteraction: v.optional(v.object({
    isLiked: v.boolean(),
    isFavorited: v.boolean(),
    rating: v.optional(v.number([v.minValue(1), v.maxValue(5)])),
    playHistory: v.optional(v.object({
      position: v.number([v.minValue(0)]), // 播放位置(秒)
      progress: v.number([v.minValue(0), v.maxValue(1)]), // 播放进度(0-1)
      updatedAt: Timestamp
    }))
  })),
  
  // 推荐内容
  recommendations: v.optional(v.object({
    relatedVideos: v.array(Video), // 相关视频
    sameActorVideos: v.array(Video), // 同演员视频
    sameCategoryVideos: v.array(Video), // 同分类视频
    sameTagVideos: v.array(Video) // 同标签视频
  }))
})

// 视频搜索/筛选参数
export const VideoSearchParams = v.object({
  keyword: v.optional(v.string()),
  categoryId: v.optional(ID),
  tags: v.optional(v.array(ID)),
  actors: v.optional(v.array(ID)),
  vipOnly: v.optional(v.boolean()),
  minDuration: v.optional(v.number([v.minValue(0)])), // 最小时长(秒)
  maxDuration: v.optional(v.number([v.minValue(0)])), // 最大时长(秒)
  releaseYear: v.optional(v.number([v.minValue(1990), v.maxValue(2030)])),
  studio: v.optional(v.string()),
  resolution: v.optional(v.string()),
  sortBy: v.optional(v.union([
    v.literal('latest'),
    v.literal('popular'),
    v.literal('views'),
    v.literal('likes'),
    v.literal('duration'),
    v.literal('rating'),
    v.literal('random')
  ])),
  sortOrder: v.optional(v.union([v.literal('asc'), v.literal('desc')]))
})

// 播放URL响应
export const PlayUrlResponse = v.object({
  streamUrl: URL,
  qualities: v.optional(v.array(VideoQuality)),
  subtitles: v.optional(v.array(v.object({
    language: v.string(),
    label: v.string(),
    url: URL
  }))),
  expiresAt: v.optional(Timestamp) // URL过期时间
})

// 导出类型
export type VideoQuality = v.InferOutput<typeof VideoQuality>
export type Category = v.InferOutput<typeof Category>
export type Tag = v.InferOutput<typeof Tag>
export type Video = v.InferOutput<typeof Video>
export type VideoDetail = v.InferOutput<typeof VideoDetail>
export type VideoSearchParams = v.InferOutput<typeof VideoSearchParams>
export type PlayUrlResponse = v.InferOutput<typeof PlayUrlResponse>
