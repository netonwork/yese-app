import { apiClient } from './client'
import type { ShareDataResponse } from '@/types/share'

/**
 * 获取分享数据（配置和统计）
 */
export const getShareData = async (): Promise<ShareDataResponse> => {
  const response = await apiClient.get('/api/share/data')
  return response.data
}

/**
 * 记录邀请点击
 */
export const recordInviteClick = async (inviteCode: string): Promise<void> => {
  await apiClient.post('/api/share/click', { inviteCode })
}

/**
 * 获取邀请收益记录
 */
export const getInviteEarnings = async (params?: {
  page?: number
  limit?: number
  type?: string
}) => {
  const response = await apiClient.get('/api/share/earnings', { params })
  return response.data
}
