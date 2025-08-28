import * as v from 'valibot'
import { ID, Timestamp, PaginationParams } from './common'

// 播放历史记录
export const PlayHistory = v.object({
  id: ID,
  videoId: ID,
  video: v.object({
    id: ID,
    title: v.string(),
    thumbnail: v.string(),
    duration: v.string(),
    durationSeconds: v.number(),
    isVip: v.boolean(),
    categoryName: v.string()
  }),
  position: v.number([v.minValue(0)]), // 播放位置(秒)
  duration: v.number([v.minValue(0)]), // 总时长(秒)
  progress: v.number([v.minValue(0), v.maxValue(1)]), // 播放进度(0-1)
  watchedAt: Timestamp,
  deviceType: v.optional(v.union([
    v.literal('web'),
    v.literal('mobile'),
    v.literal('tablet'),
    v.literal('tv')
  ])),
  ipAddress: v.optional(v.string()),
  userAgent: v.optional(v.string())
})

// 收藏记录
export const Favorite = v.object({
  id: ID,
  videoId: ID,
  video: v.object({
    id: ID,
    title: v.string(),
    thumbnail: v.string(),
    duration: v.string(),
    viewCount: v.number(),
    isVip: v.boolean(),
    categoryName: v.string(),
    actorNames: v.array(v.string())
  }),
  createdAt: Timestamp,
  // 收藏夹分类（可选功能）
  folderId: v.optional(ID),
  folderName: v.optional(v.string())
})

// 收藏夹
export const FavoriteFolder = v.object({
  id: ID,
  name: v.string([v.minLength(1), v.maxLength(50)]),
  description: v.optional(v.string([v.maxLength(200)])),
  videoCount: v.number([v.minValue(0)]),
  isDefault: v.boolean(), // 是否为默认收藏夹
  isPublic: v.boolean(), // 是否公开
  createdAt: Timestamp,
  updatedAt: Timestamp
})

// 点赞记录
export const Like = v.object({
  id: ID,
  videoId: ID,
  createdAt: Timestamp
})

// 评分记录
export const Rating = v.object({
  id: ID,
  videoId: ID,
  rating: v.number([v.minValue(1), v.maxValue(5)]),
  createdAt: Timestamp,
  updatedAt: Timestamp
})

// 评论
export const Comment = v.object({
  id: ID,
  videoId: ID,
  content: v.string([v.minLength(1), v.maxLength(1000)]),
  likeCount: v.number([v.minValue(0)]),
  replyCount: v.number([v.minValue(0)]),
  parentId: v.optional(ID), // 回复的评论ID
  isDeleted: v.boolean(),
  createdAt: Timestamp,
  updatedAt: Timestamp,
  // 用户信息
  user: v.object({
    id: ID,
    username: v.string(),
    avatar: v.optional(v.string()),
    isVip: v.boolean()
  })
})

// VIP套餐
export const VipPlan = v.object({
  id: ID,
  name: v.string([v.minLength(1), v.maxLength(50)]),
  description: v.string([v.maxLength(500)]),
  price: v.number([v.minValue(0)]), // 价格(分)
  originalPrice: v.optional(v.number([v.minValue(0)])), // 原价(分)
  duration: v.number([v.minValue(1)]), // 时长(天)
  level: v.number([v.minValue(1), v.maxValue(10)]), // VIP等级
  features: v.array(v.string()), // 特权列表
  isPopular: v.boolean(), // 是否推荐
  isActive: v.boolean(),
  order: v.number([v.minValue(0)]), // 排序
  createdAt: Timestamp,
  updatedAt: Timestamp
})

// VIP订单
export const VipOrder = v.object({
  id: ID,
  planId: ID,
  planName: v.string(),
  amount: v.number([v.minValue(0)]), // 支付金额(分)
  originalAmount: v.optional(v.number([v.minValue(0)])), // 原价(分)
  discountAmount: v.optional(v.number([v.minValue(0)])), // 优惠金额(分)
  status: v.union([
    v.literal('pending'),   // 待支付
    v.literal('paid'),      // 已支付
    v.literal('failed'),    // 支付失败
    v.literal('cancelled'), // 已取消
    v.literal('refunded')   // 已退款
  ]),
  paymentMethod: v.optional(v.string()), // 支付方式
  paymentId: v.optional(v.string()), // 第三方支付ID
  couponCode: v.optional(v.string()), // 优惠券代码
  createdAt: Timestamp,
  paidAt: v.optional(Timestamp),
  expiredAt: v.optional(Timestamp), // 订单过期时间
  // VIP生效信息
  vipStartAt: v.optional(Timestamp),
  vipEndAt: v.optional(Timestamp)
})

// 搜索历史
export const SearchHistory = v.object({
  id: ID,
  keyword: v.string([v.minLength(1), v.maxLength(100)]),
  resultCount: v.number([v.minValue(0)]),
  searchedAt: Timestamp
})

// 用户统计信息
export const UserStats = v.object({
  totalWatchTime: v.number([v.minValue(0)]), // 总观看时长(分钟)
  totalVideosWatched: v.number([v.minValue(0)]), // 观看视频总数
  favoriteCount: v.number([v.minValue(0)]), // 收藏数量
  likeCount: v.number([v.minValue(0)]), // 点赞数量
  commentCount: v.number([v.minValue(0)]), // 评论数量
  averageWatchTime: v.number([v.minValue(0)]), // 平均观看时长(分钟)
  mostWatchedCategory: v.optional(v.string()), // 最常观看的分类
  mostWatchedActor: v.optional(v.string()), // 最常观看的演员
  // 最近活动
  lastWatchedAt: v.optional(Timestamp),
  lastFavoritedAt: v.optional(Timestamp),
  lastCommentedAt: v.optional(Timestamp)
})

// API请求参数类型
export const UpdatePlayHistoryRequest = v.object({
  videoId: ID,
  position: v.number([v.minValue(0)]),
  duration: v.optional(v.number([v.minValue(0)])),
  deviceType: v.optional(v.string())
})

export const CreateFavoriteRequest = v.object({
  videoId: ID,
  folderId: v.optional(ID)
})

export const CreateFolderRequest = v.object({
  name: v.string([v.minLength(1), v.maxLength(50)]),
  description: v.optional(v.string([v.maxLength(200)])),
  isPublic: v.optional(v.boolean())
})

export const CreateCommentRequest = v.object({
  videoId: ID,
  content: v.string([v.minLength(1), v.maxLength(1000)]),
  parentId: v.optional(ID)
})

export const CreateVipOrderRequest = v.object({
  planId: ID,
  couponCode: v.optional(v.string()),
  paymentMethod: v.optional(v.string())
})

// 查询参数
export const PlayHistoryParams = v.object({
  ...PaginationParams.entries,
  categoryId: v.optional(ID),
  dateRange: v.optional(v.object({
    start: v.string(),
    end: v.string()
  }))
})

export const FavoriteParams = v.object({
  ...PaginationParams.entries,
  folderId: v.optional(ID),
  categoryId: v.optional(ID)
})

export const CommentParams = v.object({
  ...PaginationParams.entries,
  videoId: ID,
  parentId: v.optional(ID),
  sortBy: v.optional(v.union([
    v.literal('latest'),
    v.literal('oldest'),
    v.literal('likes')
  ]))
})

// 导出类型
export type PlayHistory = v.InferOutput<typeof PlayHistory>
export type Favorite = v.InferOutput<typeof Favorite>
export type FavoriteFolder = v.InferOutput<typeof FavoriteFolder>
export type Like = v.InferOutput<typeof Like>
export type Rating = v.InferOutput<typeof Rating>
export type Comment = v.InferOutput<typeof Comment>
export type VipPlan = v.InferOutput<typeof VipPlan>
export type VipOrder = v.InferOutput<typeof VipOrder>
export type SearchHistory = v.InferOutput<typeof SearchHistory>
export type UserStats = v.InferOutput<typeof UserStats>

export type UpdatePlayHistoryRequest = v.InferOutput<typeof UpdatePlayHistoryRequest>
export type CreateFavoriteRequest = v.InferOutput<typeof CreateFavoriteRequest>
export type CreateFolderRequest = v.InferOutput<typeof CreateFolderRequest>
export type CreateCommentRequest = v.InferOutput<typeof CreateCommentRequest>
export type CreateVipOrderRequest = v.InferOutput<typeof CreateVipOrderRequest>

export type PlayHistoryParams = v.InferOutput<typeof PlayHistoryParams>
export type FavoriteParams = v.InferOutput<typeof FavoriteParams>
export type CommentParams = v.InferOutput<typeof CommentParams>
