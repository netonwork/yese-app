import * as v from 'valibot'
import { apiClient } from './client'
import type {
  SearchResult,
  SearchParams,
  HotKeyword,
  Video,
  Actor,
  Tag,
  PaginatedResponse
} from '@/types'

// 验证schemas
import {
  SearchResult as SearchResultSchema,
  SearchParams as SearchParamsSchema,
  HotKeyword as HotKeywordSchema
} from '@/types'
import { Video as VideoSchema } from '@/types/video'
import { Actor as ActorSchema } from '@/types/actor'
import { Tag as TagSchema } from '@/types/video'
import { PaginatedResponse as PaginatedResponseSchema } from '@/types/common'

/**
 * 全局搜索
 */
export async function searchAll(params: SearchParams): Promise<SearchResult> {
  // 验证请求参数
  const validatedParams = v.parse(SearchParamsSchema, params)
  
  const response = await apiClient.get<SearchResult>('/search', validatedParams)
  
  // 验证响应数据
  return v.parse(SearchResultSchema, response)
}

/**
 * 搜索视频
 */
export async function searchVideos(params: {
  keyword: string
  page?: number
  limit?: number
  categoryId?: string
  tags?: string[]
  actors?: string[]
  sortBy?: 'relevance' | 'latest' | 'popular' | 'views' | 'rating'
  filters?: {
    vipOnly?: boolean
    minDuration?: number
    maxDuration?: number
    releaseYear?: number
    minRating?: number
  }
}): Promise<PaginatedResponse<Video>> {
  if (!params.keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Video>>('/search/videos', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(VideoSchema), response)
}

/**
 * 搜索演员
 */
export async function searchActors(params: {
  keyword: string
  page?: number
  limit?: number
  sortBy?: 'relevance' | 'name' | 'popular' | 'videos'
  filters?: {
    nationality?: string
    tags?: string[]
    hasVideos?: boolean
    ageRange?: { min: number; max: number }
  }
}): Promise<PaginatedResponse<Actor>> {
  if (!params.keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Actor>>('/search/actors', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(ActorSchema), response)
}

/**
 * 搜索标签
 */
export async function searchTags(params: {
  keyword: string
  page?: number
  limit?: number
  categoryId?: string
}): Promise<PaginatedResponse<Tag>> {
  if (!params.keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get<PaginatedResponse<Tag>>('/search/tags', params)
  
  // 验证响应数据
  return v.parse(PaginatedResponseSchema(TagSchema), response)
}

/**
 * 获取搜索建议
 */
export async function getSearchSuggestions(keyword: string, params: {
  limit?: number
  type?: 'all' | 'videos' | 'actors' | 'tags'
} = {}): Promise<{
  suggestions: string[]
  videos: Array<{ id: string; title: string }>
  actors: Array<{ id: string; name: string }>
  tags: Array<{ id: string; name: string }>
}> {
  if (!keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get('/search/suggestions', {
    keyword,
    ...params
  })
  
  return response
}

/**
 * 获取热门搜索关键词
 */
export async function getHotKeywords(params: {
  limit?: number
  timeRange?: 'day' | 'week' | 'month' | 'all'
  category?: 'all' | 'videos' | 'actors' | 'tags'
} = {}): Promise<HotKeyword[]> {
  const response = await apiClient.get<HotKeyword[]>('/search/hot', params)
  
  // 验证响应数据
  return v.parse(v.array(HotKeywordSchema), response)
}

/**
 * 获取搜索历史
 */
export async function getSearchHistory(params: {
  limit?: number
  type?: 'all' | 'videos' | 'actors' | 'tags'
} = {}): Promise<Array<{
  id: string
  keyword: string
  type: 'all' | 'videos' | 'actors' | 'tags'
  resultCount: number
  searchedAt: string
}>> {
  const response = await apiClient.get('/search/history', params)
  return response
}

/**
 * 清空搜索历史
 */
export async function clearSearchHistory(): Promise<void> {
  await apiClient.delete('/search/history')
}

/**
 * 删除搜索历史记录
 */
export async function deleteSearchHistory(historyId: string): Promise<void> {
  if (!historyId) {
    throw new Error('搜索历史ID不能为空')
  }
  
  await apiClient.delete(`/search/history/${historyId}`)
}

/**
 * 保存搜索记录
 */
export async function saveSearchRecord(data: {
  keyword: string
  type: 'all' | 'videos' | 'actors' | 'tags'
  resultCount: number
}): Promise<void> {
  await apiClient.post('/search/history', data)
}

/**
 * 获取相关搜索词
 */
export async function getRelatedKeywords(keyword: string, params: {
  limit?: number
} = {}): Promise<string[]> {
  if (!keyword) {
    throw new Error('搜索关键词不能为空')
  }
  
  const response = await apiClient.get<string[]>('/search/related', {
    keyword,
    ...params
  })
  
  return response
}

/**
 * 搜索自动完成
 */
export async function getAutoComplete(keyword: string, params: {
  limit?: number
  type?: 'all' | 'videos' | 'actors' | 'tags'
} = {}): Promise<Array<{
  text: string
  type: 'keyword' | 'video' | 'actor' | 'tag'
  id?: string
  count?: number
}>> {
  if (!keyword) {
    return []
  }
  
  const response = await apiClient.get('/search/autocomplete', {
    keyword,
    ...params
  })
  
  return response
}

/**
 * 高级搜索
 */
export async function advancedSearch(params: {
  // 基础搜索
  keyword?: string
  
  // 视频筛选
  categoryId?: string
  tags?: string[]
  actors?: string[]
  
  // 时间筛选
  releaseYear?: number
  dateRange?: {
    start: string // YYYY-MM-DD
    end: string   // YYYY-MM-DD
  }
  
  // 属性筛选
  minDuration?: number // 秒
  maxDuration?: number // 秒
  minRating?: number   // 1-5
  vipOnly?: boolean
  hasSubtitles?: boolean
  
  // 演员筛选
  actorNationality?: string
  actorTags?: string[]
  
  // 排序和分页
  sortBy?: 'relevance' | 'latest' | 'popular' | 'views' | 'rating' | 'duration'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}): Promise<{
  videos: PaginatedResponse<Video>
  actors: PaginatedResponse<Actor>
  totalResults: number
  searchTime: number // 搜索耗时(毫秒)
  appliedFilters: Record<string, any>
}> {
  const response = await apiClient.get('/search/advanced', params)
  
  // 验证响应数据
  return {
    ...response,
    videos: v.parse(PaginatedResponseSchema(VideoSchema), response.videos),
    actors: v.parse(PaginatedResponseSchema(ActorSchema), response.actors)
  }
}

/**
 * 搜索统计信息
 */
export async function getSearchStats(): Promise<{
  totalSearches: number
  popularKeywords: Array<{
    keyword: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  searchTrends: Array<{
    date: string
    count: number
  }>
  categoryDistribution: Array<{
    categoryId: string
    categoryName: string
    searchCount: number
    percentage: number
  }>
}> {
  const response = await apiClient.get('/search/stats')
  return response
}

/**
 * 报告搜索问题
 */
export async function reportSearchIssue(data: {
  keyword: string
  issue: 'no_results' | 'irrelevant_results' | 'missing_content' | 'other'
  description?: string
  expectedResults?: string
}): Promise<void> {
  await apiClient.post('/search/report', data)
}

/**
 * 获取搜索过滤器选项
 */
export async function getSearchFilters(): Promise<{
  categories: Array<{ id: string; name: string; count: number }>
  tags: Array<{ id: string; name: string; count: number }>
  actors: Array<{ id: string; name: string; count: number }>
  nationalities: Array<{ name: string; count: number }>
  years: Array<{ year: number; count: number }>
  durations: Array<{
    range: string // "0-10min", "10-30min", etc.
    min: number
    max: number
    count: number
  }>
}> {
  const response = await apiClient.get('/search/filters')
  return response
}
