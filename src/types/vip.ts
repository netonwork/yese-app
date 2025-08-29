/**
 * VIP相关类型定义
 */

// VIP套餐计划
export interface VipPlan {
  id: string
  name: string
  price: number
  originalPrice?: number
  duration: string
  durationDays: number
  color: string // 从服务端获取的颜色配置
  features: string[]
  isPopular?: boolean
  badge?: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// VIP套餐列表响应
export interface VipPlansResponse {
  plans: VipPlan[]
  total: number
}

// VIP权益
export interface VipFeature {
  id: string
  icon: string // 图标名称
  title: string
  description: string
  order: number
  isActive: boolean
}

// VIP权益列表响应
export interface VipFeaturesResponse {
  features: VipFeature[]
  total: number
}

// VIP订单
export interface VipOrder {
  id: string
  userId: string
  planId: string
  plan: VipPlan
  amount: number
  paymentMethod: 'alipay' | 'wechat' | 'bank_card'
  status: 'pending' | 'paid' | 'cancelled' | 'refunded'
  paidAt?: string
  expiredAt?: string
  createdAt: string
  updatedAt: string
}

// 创建VIP订单请求
export interface CreateVipOrderRequest {
  planId: string
  paymentMethod: 'alipay' | 'wechat' | 'bank_card'
}

// 创建VIP订单响应
export interface CreateVipOrderResponse {
  order: VipOrder
  paymentInfo: {
    paymentUrl?: string
    qrCode?: string
    orderNo: string
  }
}

// 用户VIP状态
export interface UserVipStatus {
  isVip: boolean
  currentPlan?: VipPlan
  expiredAt?: string
  remainingDays?: number
  autoRenew: boolean
}

// VIP统计信息
export interface VipStats {
  totalUsers: number
  vipUsers: number
  vipRate: number
  popularPlan: VipPlan
  revenue: {
    today: number
    thisMonth: number
    thisYear: number
  }
}
