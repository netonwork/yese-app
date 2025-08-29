// 导出所有类型定义
export * from './common'
export * from './auth'
export * from './video'
export * from './actor'
export * from './user'
export * from './vip'

// 搜索相关类型
import * as v from 'valibot'
import { Video } from './video'
import { Actor } from './actor'
import { Tag } from './video'
import { PaginationParams } from './common'

// 全局搜索结果
export const SearchResult = v.object({
  videos: v.array(Video),
  actors: v.array(Actor),
  tags: v.array(Tag),
  total: v.object({
    videos: v.number(),
    actors: v.number(),
    tags: v.number(),
    all: v.number()
  }),
  suggestions: v.array(v.string()), // 搜索建议
  corrections: v.optional(v.string()) // 拼写纠正
})

// 搜索参数
export const SearchParams = v.object({
  ...PaginationParams.entries,
  keyword: v.string([v.minLength(1)]),
  type: v.optional(v.union([
    v.literal('all'),
    v.literal('videos'),
    v.literal('actors'),
    v.literal('tags')
  ])),
  categoryId: v.optional(v.string()),
  filters: v.optional(v.object({
    vipOnly: v.optional(v.boolean()),
    hasVideos: v.optional(v.boolean()), // 仅搜索有视频的演员
    minRating: v.optional(v.number([v.minValue(0), v.maxValue(5)]))
  }))
})

// 热门关键词
export const HotKeyword = v.object({
  keyword: v.string(),
  searchCount: v.number(),
  trend: v.optional(v.union([
    v.literal('up'),
    v.literal('down'),
    v.literal('stable')
  ]))
})

// 导出搜索相关类型
export type SearchResult = v.InferOutput<typeof SearchResult>
export type SearchParams = v.InferOutput<typeof SearchParams>
export type HotKeyword = v.InferOutput<typeof HotKeyword>
