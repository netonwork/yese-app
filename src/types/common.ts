import * as v from 'valibot'

// 通用响应结构
export const ApiResponse = <T extends v.BaseSchema<any, any, any>>(dataSchema: T) =>
  v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
    data: dataSchema,
    timestamp: v.optional(v.string())
  })

export const PaginatedResponse = <T extends v.BaseSchema<any, any, any>>(itemSchema: T) =>
  v.object({
    items: v.array(itemSchema),
    total: v.number(),
    page: v.number(),
    limit: v.number(),
    hasMore: v.boolean()
  })

// 通用类型
export const ID = v.string()
export const Timestamp = v.string()
export const URL = v.string()
export const Email = v.string([v.email()])

// 分页参数
export const PaginationParams = v.object({
  page: v.optional(v.number([v.minValue(1)])),
  limit: v.optional(v.number([v.minValue(1), v.maxValue(100)]))
})

// 排序参数
export const SortParams = v.object({
  sortBy: v.optional(v.string()),
  sortOrder: v.optional(v.union([v.literal('asc'), v.literal('desc')]))
})

// 错误响应
export const ErrorResponse = v.object({
  success: v.literal(false),
  message: v.string(),
  code: v.optional(v.string()),
  details: v.optional(v.any()),
  timestamp: v.string()
})

// 导出类型
export type ApiResponse<T> = v.InferOutput<ReturnType<typeof ApiResponse<v.BaseSchema<T, any, any>>>>
export type PaginatedResponse<T> = v.InferOutput<ReturnType<typeof PaginatedResponse<v.BaseSchema<T, any, any>>>>
export type PaginationParams = v.InferOutput<typeof PaginationParams>
export type SortParams = v.InferOutput<typeof SortParams>
export type ErrorResponse = v.InferOutput<typeof ErrorResponse>
