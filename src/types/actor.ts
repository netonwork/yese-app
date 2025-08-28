import * as v from 'valibot'
import { ID, Timestamp, URL } from './common'

// 演员基础信息
export const Actor = v.object({
  id: ID,
  name: v.string([v.minLength(1), v.maxLength(50)]),
  slug: v.string([v.minLength(1)]),
  avatar: v.optional(URL),
  bio: v.optional(v.string([v.maxLength(1000)])),
  birthDate: v.optional(v.string()), // YYYY-MM-DD格式
  nationality: v.optional(v.string([v.maxLength(50)])),
  height: v.optional(v.number([v.minValue(100), v.maxValue(250)])), // 身高(cm)
  weight: v.optional(v.number([v.minValue(30), v.maxValue(200)])), // 体重(kg)
  measurements: v.optional(v.string()), // 三围
  videoCount: v.number([v.minValue(0)]),
  totalViews: v.number([v.minValue(0)]),
  isPopular: v.boolean(),
  isActive: v.boolean(),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // 社交链接
  socialLinks: v.optional(v.object({
    instagram: v.optional(URL),
    twitter: v.optional(URL),
    website: v.optional(URL),
    onlyfans: v.optional(URL)
  })),
  // 标签
  tags: v.array(v.string()), // 如：["亚洲", "新人", "网红"]
  // 统计数据
  stats: v.optional(v.object({
    avgRating: v.number([v.minValue(0), v.maxValue(5)]),
    totalLikes: v.number([v.minValue(0)]),
    totalFavorites: v.number([v.minValue(0)]),
    latestVideoDate: v.optional(Timestamp)
  }))
})

// 演员详情（包含更多信息）
export const ActorDetail = v.object({
  ...Actor.entries,
  // 相关视频会在API中单独获取
  recentVideos: v.optional(v.array(v.object({
    id: ID,
    title: v.string(),
    thumbnail: URL,
    duration: v.string(),
    viewCount: v.number(),
    isVip: v.boolean(),
    createdAt: Timestamp
  }))),
  // 合作演员
  collaborators: v.optional(v.array(v.object({
    id: ID,
    name: v.string(),
    avatar: v.optional(URL),
    collaborationCount: v.number()
  })))
})

// 演员搜索/筛选参数
export const ActorSearchParams = v.object({
  keyword: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  nationality: v.optional(v.string()),
  ageRange: v.optional(v.object({
    min: v.number([v.minValue(18)]),
    max: v.number([v.maxValue(60)])
  })),
  popular: v.optional(v.boolean()),
  hasVideos: v.optional(v.boolean()),
  sortBy: v.optional(v.union([
    v.literal('name'),
    v.literal('popular'),
    v.literal('videos'),
    v.literal('latest'),
    v.literal('views'),
    v.literal('rating')
  ]))
})

// 导出类型
export type Actor = v.InferOutput<typeof Actor>
export type ActorDetail = v.InferOutput<typeof ActorDetail>
export type ActorSearchParams = v.InferOutput<typeof ActorSearchParams>
