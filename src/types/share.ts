// 分享配置类型
export interface ShareConfig {
  // 奖励配置
  registerReward: number // 注册奖励的白嫖次数
  firstPurchaseRewardPercent: number // 首次购买奖励百分比
  renewalRewardPercent: number // 续费奖励百分比
  
  // 提现配置
  minWithdrawAmount: number // 最低提现金额
  coinToRmbRate: number // 花币兑换人民币汇率 (1花币=?元)
  
  // 白嫖配置
  freeViewsPerInvite: number // 每次邀请获得的白嫖次数
  viewsPerVideo: number // 每次观看消耗的白嫖次数
}

// 用户分享统计
export interface ShareStats {
  totalCoins: number // 总花币
  totalInvites: number // 邀请人数
  monthlyEarnings: number // 本月收益
  freeViews: number // 白嫖次数
  pendingRewards: number // 待结算奖励
}

// 分享数据响应
export interface ShareDataResponse {
  config: ShareConfig
  stats: ShareStats
  inviteUrl: string // 邀请链接
}
