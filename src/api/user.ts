import * as v from 'valibot'
import { apiClient } from './client'
import type {
  PlayHistory,
  Favorite,
  FavoriteFolder,
  Comment,
  VipPlan,
  VipOrder,
  UserStats,
  UpdatePlayHistoryRequest,
  CreateFavoriteRequest,
  CreateFolderRequest,
  CreateCommentRequest,
  CreateVipOrderRequest,
  PlayHistoryParams,
  FavoriteParams,
  CommentParams,
  PaginatedResponse
} from '@/types'

// 验证schemas
import {
  PlayHistory as PlayHistorySchema,
  Favorite as FavoriteSchema,
  FavoriteFolder as FavoriteFolderSchema,
  Comment as CommentSchema,
  VipPlan as VipPlanSchema,
  VipOrder as VipOrderSchema,
  UserStats as UserStatsSchema,
  UpdatePlayHistoryRequest as UpdatePlayHistoryRequestSchema,
  CreateFavoriteRequest as CreateFavoriteRequestSchema,
  CreateFolderRequest as CreateFolderRequestSchema,
  CreateCommentRequest as CreateCommentRequestSchema,
  CreateVipOrderRequest as CreateVipOrderRequestSchema
} from '@/types/user'
import { PaginatedResponse as PaginatedResponseSchema } from '@/types/common'

// ==================== 播放历史相关 ====================

/**
 * 获取播放历史
 */
export async function getPlayHistory(params: PlayHistoryParams = {}): Promise<PaginatedResponse<PlayHistory>> {
  const response = await apiClient.get<PaginatedResponse<PlayHistory>>('/user/history', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(PlayHistorySchema), response)
}

/**
 * 更新播放历史
 */
export async function updatePlayHistory(data: UpdatePlayHistoryRequest): Promise<void> {
  // 验证请求数据
  const validatedData = v.parse(UpdatePlayHistoryRequestSchema, data)
  
  await apiClient.post('/user/history', validatedData)
}

/**
 * 删除播放历史记录
 */
export async function deletePlayHistory(historyId: string): Promise<void> {
  if (!historyId) {
    throw new Error('历史记录ID不能为空')
  }
  
  await apiClient.delete(`/user/history/${historyId}`)
}

/**
 * 清空播放历史
 */
export async function clearPlayHistory(): Promise<void> {
  await apiClient.delete('/user/history')
}

/**
 * 获取播放进度
 */
export async function getPlayProgress(videoId: string): Promise<{
  position: number
  progress: number
  updatedAt: string
} | null> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/user/history/${videoId}/progress`)
  return response
}

// ==================== 收藏相关 ====================

/**
 * 获取收藏列表
 */
export async function getFavorites(params: FavoriteParams = {}): Promise<PaginatedResponse<Favorite>> {
  const response = await apiClient.get<PaginatedResponse<Favorite>>('/user/favorites', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(FavoriteSchema), response)
}

/**
 * 添加/取消收藏
 */
export async function toggleFavorite(data: CreateFavoriteRequest): Promise<{
  isFavorited: boolean
  favoriteCount: number
}> {
  // 验证请求数据
  const validatedData = v.parse(CreateFavoriteRequestSchema, data)
  
  const response = await apiClient.post('/user/favorites', validatedData)
  return response
}

/**
 * 检查视频是否已收藏
 */
export async function checkFavoriteStatus(videoId: string): Promise<{
  isFavorited: boolean
  folderId?: string
  folderName?: string
}> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/user/favorites/${videoId}/status`)
  return response
}

/**
 * 移动收藏到其他文件夹
 */
export async function moveFavorite(favoriteId: string, folderId: string): Promise<void> {
  if (!favoriteId) {
    throw new Error('收藏ID不能为空')
  }
  
  await apiClient.patch(`/user/favorites/${favoriteId}`, { folderId })
}

/**
 * 批量删除收藏
 */
export async function deleteFavorites(favoriteIds: string[]): Promise<void> {
  if (!favoriteIds.length) {
    throw new Error('收藏ID列表不能为空')
  }
  
  await apiClient.delete('/user/favorites/batch', { ids: favoriteIds })
}

// ==================== 收藏夹相关 ====================

/**
 * 获取收藏夹列表
 */
export async function getFavoriteFolders(): Promise<FavoriteFolder[]> {
  const response = await apiClient.get<FavoriteFolder[]>('/user/folders')
  
  // 验证响应数据
  return v.parse(v.array(FavoriteFolderSchema), response)
}

/**
 * 创建收藏夹
 */
export async function createFavoriteFolder(data: CreateFolderRequest): Promise<FavoriteFolder> {
  // 验证请求数据
  const validatedData = v.parse(CreateFolderRequestSchema, data)
  
  const response = await apiClient.post<FavoriteFolder>('/user/folders', validatedData)
  
  // 验证响应数据
  return v.parse(FavoriteFolderSchema, response)
}

/**
 * 更新收藏夹
 */
export async function updateFavoriteFolder(
  folderId: string,
  data: Partial<CreateFolderRequest>
): Promise<FavoriteFolder> {
  if (!folderId) {
    throw new Error('收藏夹ID不能为空')
  }
  
  const response = await apiClient.put<FavoriteFolder>(`/user/folders/${folderId}`, data)
  
  // 验证响应数据
  return v.parse(FavoriteFolderSchema, response)
}

/**
 * 删除收藏夹
 */
export async function deleteFavoriteFolder(folderId: string): Promise<void> {
  if (!folderId) {
    throw new Error('收藏夹ID不能为空')
  }
  
  await apiClient.delete(`/user/folders/${folderId}`)
}

// ==================== 点赞相关 ====================

/**
 * 点赞/取消点赞视频
 */
export async function toggleLike(videoId: string): Promise<{
  isLiked: boolean
  likeCount: number
}> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.post(`/user/likes/${videoId}`)
  return response
}

/**
 * 检查视频点赞状态
 */
export async function checkLikeStatus(videoId: string): Promise<{
  isLiked: boolean
}> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/user/likes/${videoId}/status`)
  return response
}

/**
 * 获取用户点赞的视频列表
 */
export async function getLikedVideos(params: {
  page?: number
  limit?: number
} = {}): Promise<PaginatedResponse<{
  id: string
  videoId: string
  video: {
    id: string
    title: string
    thumbnail: string
    duration: string
    viewCount: number
    isVip: boolean
  }
  createdAt: string
}>> {
  const response = await apiClient.get('/user/likes', params)
  return response
}

// ==================== 评分相关 ====================

/**
 * 给视频评分
 */
export async function rateVideo(videoId: string, rating: number): Promise<{
  rating: number
  avgRating: number
  ratingCount: number
}> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  if (rating < 1 || rating > 5) {
    throw new Error('评分必须在1-5之间')
  }
  
  const response = await apiClient.post(`/user/ratings/${videoId}`, { rating })
  return response
}

/**
 * 获取用户对视频的评分
 */
export async function getUserRating(videoId: string): Promise<{
  rating: number
  createdAt: string
} | null> {
  if (!videoId) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/user/ratings/${videoId}`)
  return response
}

// ==================== 评论相关 ====================

/**
 * 获取视频评论
 */
export async function getVideoComments(params: CommentParams): Promise<PaginatedResponse<Comment>> {
  const response = await apiClient.get<PaginatedResponse<Comment>>('/comments', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(CommentSchema), response)
}

/**
 * 发表评论
 */
export async function createComment(data: CreateCommentRequest): Promise<Comment> {
  // 验证请求数据
  const validatedData = v.parse(CreateCommentRequestSchema, data)
  
  const response = await apiClient.post<Comment>('/comments', validatedData)
  
  // 验证响应数据
  return v.parse(CommentSchema, response)
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string): Promise<void> {
  if (!commentId) {
    throw new Error('评论ID不能为空')
  }
  
  await apiClient.delete(`/comments/${commentId}`)
}

/**
 * 点赞/取消点赞评论
 */
export async function toggleCommentLike(commentId: string): Promise<{
  isLiked: boolean
  likeCount: number
}> {
  if (!commentId) {
    throw new Error('评论ID不能为空')
  }
  
  const response = await apiClient.post(`/comments/${commentId}/like`)
  return response
}

// ==================== VIP相关 ====================

/**
 * 获取VIP套餐列表
 */
export async function getVipPlans(): Promise<VipPlan[]> {
  const response = await apiClient.get<VipPlan[]>('/vip/plans')
  
  // 验证响应数据
  return v.parse(v.array(VipPlanSchema), response)
}

/**
 * 创建VIP订单
 */
export async function createVipOrder(data: CreateVipOrderRequest): Promise<VipOrder> {
  // 验证请求数据
  const validatedData = v.parse(CreateVipOrderRequestSchema, data)
  
  const response = await apiClient.post<VipOrder>('/vip/orders', validatedData)
  
  // 验证响应数据
  return v.parse(VipOrderSchema, response)
}

/**
 * 获取VIP订单列表
 */
export async function getVipOrders(params: {
  page?: number
  limit?: number
  status?: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded'
} = {}): Promise<PaginatedResponse<VipOrder>> {
  const response = await apiClient.get<PaginatedResponse<VipOrder>>('/vip/orders', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VipOrderSchema), response)
}

/**
 * 获取VIP订单详情
 */
export async function getVipOrder(orderId: string): Promise<VipOrder> {
  if (!orderId) {
    throw new Error('订单ID不能为空')
  }
  
  const response = await apiClient.get<VipOrder>(`/vip/orders/${orderId}`)
  
  // 验证响应数据
  return v.parse(VipOrderSchema, response)
}

/**
 * 取消VIP订单
 */
export async function cancelVipOrder(orderId: string): Promise<void> {
  if (!orderId) {
    throw new Error('订单ID不能为空')
  }
  
  await apiClient.post(`/vip/orders/${orderId}/cancel`)
}

/**
 * 获取用户统计信息
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await apiClient.get<UserStats>('/user/stats')
  
  // 验证响应数据
  return v.parse(UserStatsSchema, response)
}

/**
 * 获取用户活动时间线
 */
export async function getUserTimeline(params: {
  page?: number
  limit?: number
  type?: 'all' | 'watch' | 'favorite' | 'like' | 'comment'
} = {}): Promise<PaginatedResponse<{
  id: string
  type: 'watch' | 'favorite' | 'like' | 'comment' | 'rating'
  videoId: string
  videoTitle: string
  videoThumbnail: string
  createdAt: string
  metadata?: Record<string, any>
}>> {
  const response = await apiClient.get('/user/timeline', params)
  return response
}
