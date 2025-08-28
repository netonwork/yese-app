import * as v from 'valibot'
import { apiClient } from './client'
import type {
  Video,
  VideoDetail,
  VideoSearchParams,
  PlayUrlResponse,
  Category,
  Tag,
  PaginatedResponse
} from '@/types'

// 验证schemas
import {
  Video as VideoSchema,
  VideoDetail as VideoDetailSchema,
  VideoSearchParams as VideoSearchParamsSchema,
  PlayUrlResponse as PlayUrlResponseSchema,
  Category as CategorySchema,
  Tag as TagSchema
} from '@/types/video'
import { PaginatedResponse as PaginatedResponseSchema } from '@/types/common'

/**
 * 获取视频列表
 */
export async function getVideos(params: VideoSearchParams = {}): Promise<PaginatedResponse<Video>> {
  // 验证请求参数
  const validatedParams = v.parse(VideoSearchParamsSchema, params)
  
  const response = await apiClient.get<PaginatedResponse<Video>>('/videos', validatedParams)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VideoSchema), response)
}

/**
 * 获取视频详情
 */
export async function getVideo(id: string): Promise<VideoDetail> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get<VideoDetail>(`/videos/${id}`)
  
  // 验证响应数据
  return v.parse(VideoDetailSchema, response)
}

/**
 * 获取视频播放地址
 */
export async function getVideoPlayUrl(id: string): Promise<PlayUrlResponse> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get<PlayUrlResponse>(`/videos/${id}/play`)
  
  // 验证响应数据
  return v.parse(PlayUrlResponseSchema, response)
}

/**
 * 记录视频播放次数
 */
export async function recordVideoView(id: string, data?: {
  position?: number
  duration?: number
  quality?: string
  deviceType?: string
}): Promise<void> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  await apiClient.post(`/videos/${id}/view`, data)
}

/**
 * 获取推荐视频
 */
export async function getRecommendedVideos(params: {
  limit?: number
  excludeIds?: string[]
  categoryId?: string
  userId?: string
} = {}): Promise<Video[]> {
  const response = await apiClient.get<Video[]>('/videos/recommended', params)
  
  // 验证响应数据
  return v.parse(v.array(VideoSchema), response)
}

/**
 * 获取热门视频
 */
export async function getPopularVideos(params: {
  timeRange?: 'day' | 'week' | 'month' | 'all'
  limit?: number
  categoryId?: string
} = {}): Promise<Video[]> {
  const response = await apiClient.get<Video[]>('/videos/popular', params)
  
  // 验证响应数据
  return v.parse(v.array(VideoSchema), response)
}

/**
 * 获取最新视频
 */
export async function getLatestVideos(params: {
  limit?: number
  categoryId?: string
} = {}): Promise<Video[]> {
  const response = await apiClient.get<Video[]>('/videos/latest', params)
  
  // 验证响应数据
  return v.parse(v.array(VideoSchema), response)
}

/**
 * 获取相关视频
 */
export async function getRelatedVideos(id: string, params: {
  limit?: number
  type?: 'category' | 'tags' | 'actors' | 'mixed'
} = {}): Promise<Video[]> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get<Video[]>(`/videos/${id}/related`, params)
  
  // 验证响应数据
  return v.parse(v.array(VideoSchema), response)
}

/**
 * 获取分类列表
 */
export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories')
  
  // 验证响应数据
  return v.parse(v.array(CategorySchema), response)
}

/**
 * 获取分类详情
 */
export async function getCategory(id: string): Promise<Category> {
  if (!id) {
    throw new Error('分类ID不能为空')
  }
  
  const response = await apiClient.get<Category>(`/categories/${id}`)
  
  // 验证响应数据
  return v.parse(CategorySchema, response)
}

/**
 * 获取分类下的视频
 */
export async function getCategoryVideos(
  categoryId: string,
  params: {
    page?: number
    limit?: number
    sortBy?: 'latest' | 'popular' | 'views' | 'rating'
    tags?: string[]
    actors?: string[]
  } = {}
): Promise<PaginatedResponse<Video>> {
  if (!categoryId) {
    throw new Error('分类ID不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Video>>(
    `/categories/${categoryId}/videos`,
    params
  )
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VideoSchema), response)
}

/**
 * 获取标签列表
 */
export async function getTags(params: {
  categoryId?: string
  popular?: boolean
  limit?: number
  keyword?: string
} = {}): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/tags', params)
  
  // 验证响应数据
  return v.parse(v.array(TagSchema), response)
}

/**
 * 获取热门标签
 */
export async function getPopularTags(params: {
  limit?: number
  categoryId?: string
} = {}): Promise<Tag[]> {
  const response = await apiClient.get<Tag[]>('/tags/popular', params)
  
  // 验证响应数据
  return v.parse(v.array(TagSchema), response)
}

/**
 * 获取标签详情
 */
export async function getTag(id: string): Promise<Tag> {
  if (!id) {
    throw new Error('标签ID不能为空')
  }
  
  const response = await apiClient.get<Tag>(`/tags/${id}`)
  
  // 验证响应数据
  return v.parse(TagSchema, response)
}

/**
 * 获取标签下的视频
 */
export async function getTagVideos(
  tagId: string,
  params: {
    page?: number
    limit?: number
    sortBy?: 'latest' | 'popular' | 'views' | 'rating'
    categoryId?: string
    actors?: string[]
  } = {}
): Promise<PaginatedResponse<Video>> {
  if (!tagId) {
    throw new Error('标签ID不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Video>>(
    `/tags/${tagId}/videos`,
    params
  )
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VideoSchema), response)
}

/**
 * 获取视频统计信息
 */
export async function getVideoStats(id: string): Promise<{
  viewCount: number
  likeCount: number
  favoriteCount: number
  commentCount: number
  shareCount: number
  rating: number
  ratingCount: number
}> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/videos/${id}/stats`)
  return response
}

/**
 * 报告视频问题
 */
export async function reportVideo(id: string, data: {
  reason: 'copyright' | 'inappropriate' | 'spam' | 'broken' | 'other'
  description?: string
  email?: string
}): Promise<void> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  await apiClient.post(`/videos/${id}/report`, data)
}

/**
 * 获取视频缩略图时间轴
 */
export async function getVideoThumbnails(id: string): Promise<{
  interval: number // 缩略图间隔(秒)
  thumbnails: Array<{
    time: number
    url: string
  }>
}> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/videos/${id}/thumbnails`)
  return response
}

/**
 * 获取视频字幕列表
 */
export async function getVideoSubtitles(id: string): Promise<Array<{
  language: string
  label: string
  url: string
  isDefault: boolean
}>> {
  if (!id) {
    throw new Error('视频ID不能为空')
  }
  
  const response = await apiClient.get(`/videos/${id}/subtitles`)
  return response
}
