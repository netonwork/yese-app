import * as v from 'valibot'
import { apiClient } from './client'
import type {
  Actor,
  ActorDetail,
  ActorSearchParams,
  Video,
  PaginatedResponse
} from '@/types'

// 验证schemas
import {
  Actor as ActorSchema,
  ActorDetail as ActorDetailSchema,
  ActorSearchParams as ActorSearchParamsSchema
} from '@/types/actor'
import { Video as VideoSchema } from '@/types/video'
import { PaginatedResponse as PaginatedResponseSchema } from '@/types/common'

/**
 * 获取演员列表
 */
export async function getActors(params: ActorSearchParams = {}): Promise<PaginatedResponse<Actor>> {
  // 验证请求参数
  const validatedParams = v.parse(ActorSearchParamsSchema, params)
  
  const response = await apiClient.get<PaginatedResponse<Actor>>('/actors', validatedParams)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(ActorSchema), response)
}

/**
 * 获取演员详情
 */
export async function getActor(id: string): Promise<ActorDetail> {
  if (!id) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get<ActorDetail>(`/actors/${id}`)
  
  // 验证响应数据
  return v.parse(ActorDetailSchema, response)
}

/**
 * 通过slug获取演员详情
 */
export async function getActorBySlug(slug: string): Promise<ActorDetail> {
  if (!slug) {
    throw new Error('演员slug不能为空')
  }
  
  const response = await apiClient.get<ActorDetail>(`/actors/slug/${slug}`)
  
  // 验证响应数据
  return v.parse(ActorDetailSchema, response)
}

/**
 * 获取热门演员
 */
export async function getPopularActors(params: {
  limit?: number
  timeRange?: 'day' | 'week' | 'month' | 'all'
  categoryId?: string
} = {}): Promise<Actor[]> {
  const response = await apiClient.get<Actor[]>('/actors/popular', params)
  
  // 验证响应数据
  return v.parse(v.array(ActorSchema), response)
}

/**
 * 获取新人演员
 */
export async function getNewActors(params: {
  limit?: number
  days?: number // 多少天内的新人
} = {}): Promise<Actor[]> {
  const response = await apiClient.get<Actor[]>('/actors/new', params)
  
  // 验证响应数据
  return v.parse(v.array(ActorSchema), response)
}

/**
 * 获取演员的视频作品
 */
export async function getActorVideos(
  actorId: string,
  params: {
    page?: number
    limit?: number
    sortBy?: 'latest' | 'popular' | 'views' | 'rating'
    categoryId?: string
    tags?: string[]
  } = {}
): Promise<PaginatedResponse<Video>> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Video>>(
    `/actors/${actorId}/videos`,
    params
  )
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VideoSchema), response)
}

/**
 * 获取演员的合作伙伴
 */
export async function getActorCollaborators(
  actorId: string,
  params: {
    limit?: number
    minCollaborations?: number
  } = {}
): Promise<Array<{
  actor: Actor
  collaborationCount: number
  latestCollaboration: string
  popularVideos: Video[]
}>> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get(`/actors/${actorId}/collaborators`, params)
  
  // 验证响应数据中的演员和视频
  return response.map((item: any) => ({
    ...item,
    actor: v.parse(ActorSchema, item.actor),
    popularVideos: v.parse(v.array(VideoSchema), item.popularVideos)
  }))
}

/**
 * 获取相似演员
 */
export async function getSimilarActors(
  actorId: string,
  params: {
    limit?: number
    algorithm?: 'tags' | 'collaborations' | 'categories' | 'mixed'
  } = {}
): Promise<Actor[]> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get<Actor[]>(`/actors/${actorId}/similar`, params)
  
  // 验证响应数据
  return v.parse(v.array(ActorSchema), response)
}

/**
 * 搜索演员
 */
export async function searchActors(params: {
  keyword: string
  page?: number
  limit?: number
  filters?: {
    nationality?: string
    tags?: string[]
    ageRange?: { min: number; max: number }
    hasVideos?: boolean
  }
  sortBy?: 'relevance' | 'name' | 'popular' | 'videos' | 'latest'
}): Promise<PaginatedResponse<Actor>> {
  if (!params.keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Actor>>('/actors/search', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(ActorSchema), response)
}

/**
 * 获取演员统计信息
 */
export async function getActorStats(actorId: string): Promise<{
  totalVideos: number
  totalViews: number
  totalLikes: number
  totalFavorites: number
  avgRating: number
  ratingCount: number
  popularCategories: Array<{
    categoryId: string
    categoryName: string
    videoCount: number
  }>
  popularTags: Array<{
    tagId: string
    tagName: string
    videoCount: number
  }>
  collaboratorCount: number
  latestVideoDate: string
  careerStartDate: string
}> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get(`/actors/${actorId}/stats`)
  return response
}

/**
 * 关注/取消关注演员
 */
export async function toggleActorFollow(actorId: string): Promise<{
  isFollowing: boolean
  followerCount: number
}> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.post(`/actors/${actorId}/follow`)
  return response
}

/**
 * 获取用户关注的演员列表
 */
export async function getFollowedActors(params: {
  page?: number
  limit?: number
  sortBy?: 'latest' | 'name' | 'videos'
} = {}): Promise<PaginatedResponse<Actor>> {
  const response = await apiClient.get<PaginatedResponse<Actor>>('/actors/followed', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(ActorSchema), response)
}

/**
 * 获取演员的粉丝数量
 */
export async function getActorFollowerCount(actorId: string): Promise<{
  followerCount: number
  isFollowing: boolean
}> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  const response = await apiClient.get(`/actors/${actorId}/followers/count`)
  return response
}

/**
 * 获取演员标签云
 */
export async function getActorTags(params: {
  limit?: number
  minCount?: number
} = {}): Promise<Array<{
  tag: string
  count: number
  actors: Actor[]
}>> {
  const response = await apiClient.get('/actors/tags', params)
  
  // 验证响应数据中的演员
  return response.map((item: any) => ({
    ...item,
    actors: v.parse(v.array(ActorSchema), item.actors)
  }))
}

/**
 * 按国籍获取演员
 */
export async function getActorsByNationality(
  nationality: string,
  params: {
    page?: number
    limit?: number
    sortBy?: 'name' | 'popular' | 'videos' | 'latest'
  } = {}
): Promise<PaginatedResponse<Actor>> {
  if (!nationality) {
    throw new Error('国籍不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Actor>>(
    `/actors/nationality/${nationality}`,
    params
  )
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(ActorSchema), response)
}

/**
 * 获取所有国籍列表
 */
export async function getActorNationalities(): Promise<Array<{
  nationality: string
  count: number
  popularActors: Actor[]
}>> {
  const response = await apiClient.get('/actors/nationalities')
  
  // 验证响应数据中的演员
  return response.map((item: any) => ({
    ...item,
    popularActors: v.parse(v.array(ActorSchema), item.popularActors)
  }))
}

/**
 * 报告演员信息错误
 */
export async function reportActorInfo(actorId: string, data: {
  field: 'name' | 'bio' | 'birthDate' | 'nationality' | 'measurements' | 'other'
  currentValue?: string
  suggestedValue?: string
  description: string
  email?: string
}): Promise<void> {
  if (!actorId) {
    throw new Error('演员ID不能为空')
  }
  
  await apiClient.post(`/actors/${actorId}/report`, data)
}
