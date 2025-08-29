/**
 * VIP会员相关API
 */

import { apiClient } from './client'
import type {
  VipPlansResponse,
  VipFeaturesResponse,
  CreateVipOrderRequest,
  CreateVipOrderResponse,
  UserVipStatus,
  VipStats,
  VipOrder
} from '@/types/vip'

/**
 * 获取VIP套餐列表
 */
export const getVipPlans = async (): Promise<VipPlansResponse> => {
  return apiClient.get<VipPlansResponse>('/vip/plans')
}

/**
 * 获取VIP权益列表
 */
export const getVipFeatures = async (): Promise<VipFeaturesResponse> => {
  return apiClient.get<VipFeaturesResponse>('/vip/features')
}

/**
 * 获取用户VIP状态
 */
export const getUserVipStatus = async (): Promise<UserVipStatus> => {
  return apiClient.get<UserVipStatus>('/vip/status')
}

/**
 * 创建VIP订单
 */
export const createVipOrder = async (data: CreateVipOrderRequest): Promise<CreateVipOrderResponse> => {
  return apiClient.post<CreateVipOrderResponse>('/vip/orders', data)
}

/**
 * 获取用户VIP订单列表
 */
export const getUserVipOrders = async (params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<{
  orders: VipOrder[]
  total: number
  page: number
  limit: number
}> => {
  return apiClient.get('/vip/orders', params)
}

/**
 * 获取VIP订单详情
 */
export const getVipOrderDetail = async (orderId: string): Promise<VipOrder> => {
  return apiClient.get<VipOrder>(`/vip/orders/${orderId}`)
}

/**
 * 取消VIP订单
 */
export const cancelVipOrder = async (orderId: string): Promise<void> => {
  return apiClient.post(`/vip/orders/${orderId}/cancel`)
}

/**
 * 申请VIP订单退款
 */
export const refundVipOrder = async (orderId: string, reason?: string): Promise<void> => {
  return apiClient.post(`/vip/orders/${orderId}/refund`, { reason })
}

/**
 * 获取VIP统计信息（管理员）
 */
export const getVipStats = async (): Promise<VipStats> => {
  return apiClient.get<VipStats>('/admin/vip/stats')
}

/**
 * 检查支付状态
 */
export const checkPaymentStatus = async (orderId: string): Promise<{
  status: 'pending' | 'paid' | 'cancelled' | 'failed'
  paidAt?: string
}> => {
  return apiClient.get(`/vip/orders/${orderId}/payment-status`)
}
