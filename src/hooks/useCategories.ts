import { useState, useEffect } from 'react'
import { getCategories } from '@/api/videos'
import { getIconComponent } from '@/utils/iconMapper'
import type { Category as ApiCategory } from '@/types'

// 前端使用的分类类型（包含图标组件）
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon: React.ComponentType<{ className?: string }>
  thumbnail?: string
  videoCount: number
  order: number
  isActive: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('开始获取分类数据...')
        setLoading(true)
        setError(null)
        
        const apiCategories = await getCategories()
        console.log('API返回的分类数据:', apiCategories)
        
        // 转换API数据为前端使用的格式
        const transformedCategories: Category[] = apiCategories.map((apiCategory: ApiCategory) => ({
          ...apiCategory,
          icon: getIconComponent(apiCategory.icon || 'Play')
        }))
        
        console.log('转换后的分类数据:', transformedCategories)
        setCategories(transformedCategories)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError(err instanceof Error ? err.message : '获取分类失败')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      // 重新触发useEffect
      setCategories([])
    }
  }
}
