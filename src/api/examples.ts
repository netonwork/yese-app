/**
 * API使用示例
 * 这个文件展示了如何使用各个API模块
 */

import {
  // 认证相关
  login,
  register,
  getCurrentUser,
  logout,
  
  // 视频相关
  getVideos,
  getVideo,
  getVideoPlayUrl,
  getCategories,
  getTags,
  
  // 演员相关
  getActors,
  getActor,
  getActorVideos,
  
  // 用户行为相关
  updatePlayHistory,
  toggleFavorite,
  toggleLike,
  createComment,
  
  // 搜索相关
  searchAll,
  getSearchSuggestions,
  getHotKeywords,
  
  // 工具函数
  withRetry,
  withCache,
  uploadFile
} from './index'

// ==================== 认证示例 ====================

/**
 * 用户登录示例
 */
export async function loginExample() {
  try {
    const result = await login({
      username: 'demo',
      password: 'password123'
    })
    
    console.log('登录成功:', result.user)
    console.log('访问令牌:', result.accessToken)
    
    // Token会自动保存到localStorage
    return result
  } catch (error) {
    console.error('登录失败:', error)
    throw error
  }
}

/**
 * 用户注册示例
 */
export async function registerExample() {
  try {
    const result = await register({
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    })
    
    console.log('注册成功:', result.user)
    return result
  } catch (error) {
    console.error('注册失败:', error)
    throw error
  }
}

// ==================== 视频相关示例 ====================

/**
 * 获取视频列表示例
 */
export async function getVideosExample() {
  try {
    // 获取最新视频
    const latestVideos = await getVideos({
      page: 1,
      limit: 20,
      sortBy: 'latest'
    })
    
    console.log('最新视频:', latestVideos.items)
    console.log('总数:', latestVideos.total)
    
    // 按分类筛选
    const actionVideos = await getVideos({
      categoryId: 'action',
      page: 1,
      limit: 10
    })
    
    console.log('动作片:', actionVideos.items)
    
    // 按标签和演员筛选
    const filteredVideos = await getVideos({
      tags: ['hot', 'hd'],
      actors: ['actor-001'],
      vipOnly: false,
      sortBy: 'popular'
    })
    
    console.log('筛选结果:', filteredVideos.items)
    
    return { latestVideos, actionVideos, filteredVideos }
  } catch (error) {
    console.error('获取视频失败:', error)
    throw error
  }
}

/**
 * 获取视频详情和播放地址示例
 */
export async function getVideoDetailExample(videoId: string) {
  try {
    // 获取视频详情
    const videoDetail = await getVideo(videoId)
    console.log('视频详情:', videoDetail)
    
    // 获取播放地址（需要登录）
    const playUrl = await getVideoPlayUrl(videoId)
    console.log('播放地址:', playUrl.streamUrl)
    console.log('可用画质:', playUrl.qualities)
    
    return { videoDetail, playUrl }
  } catch (error) {
    console.error('获取视频详情失败:', error)
    throw error
  }
}

/**
 * 获取分类和标签示例
 */
export async function getCategoriesAndTagsExample() {
  try {
    // 获取所有分类
    const categories = await getCategories()
    console.log('分类列表:', categories)
    
    // 获取热门标签
    const hotTags = await getTags({ popular: true, limit: 20 })
    console.log('热门标签:', hotTags)
    
    // 获取特定分类的标签
    const actionTags = await getTags({ categoryId: 'action' })
    console.log('动作片标签:', actionTags)
    
    return { categories, hotTags, actionTags }
  } catch (error) {
    console.error('获取分类标签失败:', error)
    throw error
  }
}

// ==================== 演员相关示例 ====================

/**
 * 获取演员信息示例
 */
export async function getActorsExample() {
  try {
    // 获取热门演员
    const popularActors = await getActors({
      popular: true,
      limit: 20,
      sortBy: 'popular'
    })
    
    console.log('热门演员:', popularActors.items)
    
    // 搜索演员
    const searchResults = await getActors({
      keyword: '美女',
      nationality: '日本',
      sortBy: 'videos'
    })
    
    console.log('搜索结果:', searchResults.items)
    
    return { popularActors, searchResults }
  } catch (error) {
    console.error('获取演员失败:', error)
    throw error
  }
}

/**
 * 获取演员详情和作品示例
 */
export async function getActorDetailExample(actorId: string) {
  try {
    // 获取演员详情
    const actorDetail = await getActor(actorId)
    console.log('演员详情:', actorDetail)
    
    // 获取演员的视频作品
    const actorVideos = await getActorVideos(actorId, {
      page: 1,
      limit: 10,
      sortBy: 'latest'
    })
    
    console.log('演员作品:', actorVideos.items)
    
    return { actorDetail, actorVideos }
  } catch (error) {
    console.error('获取演员详情失败:', error)
    throw error
  }
}

// ==================== 用户行为示例 ====================

/**
 * 用户交互示例
 */
export async function userInteractionExample(videoId: string) {
  try {
    // 更新播放历史
    await updatePlayHistory({
      videoId,
      position: 300, // 播放到5分钟
      deviceType: 'web'
    })
    
    console.log('播放历史已更新')
    
    // 收藏视频
    const favoriteResult = await toggleFavorite({ videoId })
    console.log('收藏状态:', favoriteResult.isFavorited)
    
    // 点赞视频
    const likeResult = await toggleLike(videoId)
    console.log('点赞状态:', likeResult.isLiked)
    
    // 发表评论
    const comment = await createComment({
      videoId,
      content: '这个视频很棒！'
    })
    
    console.log('评论已发表:', comment)
    
    return { favoriteResult, likeResult, comment }
  } catch (error) {
    console.error('用户交互失败:', error)
    throw error
  }
}

// ==================== 搜索示例 ====================

/**
 * 搜索功能示例
 */
export async function searchExample() {
  try {
    // 全局搜索
    const searchResults = await searchAll({
      keyword: '美女',
      page: 1,
      limit: 10
    })
    
    console.log('搜索结果:', searchResults)
    console.log('视频:', searchResults.videos)
    console.log('演员:', searchResults.actors)
    console.log('标签:', searchResults.tags)
    
    // 获取搜索建议
    const suggestions = await getSearchSuggestions('美')
    console.log('搜索建议:', suggestions)
    
    // 获取热门关键词
    const hotKeywords = await getHotKeywords({ limit: 10 })
    console.log('热门关键词:', hotKeywords)
    
    return { searchResults, suggestions, hotKeywords }
  } catch (error) {
    console.error('搜索失败:', error)
    throw error
  }
}

// ==================== 高级功能示例 ====================

/**
 * 使用重试机制的API调用示例
 */
export async function withRetryExample() {
  try {
    const videos = await withRetry(
      () => getVideos({ page: 1, limit: 10 }),
      {
        maxRetries: 3,
        delay: 1000,
        backoff: true
      }
    )
    
    console.log('重试获取视频成功:', videos)
    return videos
  } catch (error) {
    console.error('重试后仍然失败:', error)
    throw error
  }
}

/**
 * 使用缓存的API调用示例
 */
export async function withCacheExample() {
  try {
    // 第一次调用会请求API
    const categories1 = await withCache(
      'categories',
      () => getCategories(),
      10 * 60 * 1000 // 缓存10分钟
    )
    
    console.log('第一次获取分类:', categories1)
    
    // 第二次调用会使用缓存
    const categories2 = await withCache(
      'categories',
      () => getCategories(),
      10 * 60 * 1000
    )
    
    console.log('第二次获取分类（来自缓存）:', categories2)
    
    return { categories1, categories2 }
  } catch (error) {
    console.error('缓存示例失败:', error)
    throw error
  }
}

/**
 * 文件上传示例
 */
export async function uploadExample(file: File) {
  try {
    const result = await uploadFile('/auth/avatar', file, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      onProgress: (progress) => {
        console.log(`上传进度: ${progress}%`)
      },
      additionalData: {
        category: 'avatar'
      }
    })
    
    console.log('上传成功:', result)
    return result
  } catch (error) {
    console.error('上传失败:', error)
    throw error
  }
}

// ==================== 组合使用示例 ====================

/**
 * 完整的用户流程示例
 */
export async function completeUserFlowExample() {
  try {
    // 1. 用户登录
    const authResult = await login({
      username: 'demo',
      password: 'password123'
    })
    
    console.log('用户已登录:', authResult.user)
    
    // 2. 获取推荐视频
    const videos = await getVideos({
      page: 1,
      limit: 20,
      sortBy: 'popular'
    })
    
    console.log('获取到视频:', videos.items.length)
    
    // 3. 观看第一个视频
    const firstVideo = videos.items[0]
    if (firstVideo) {
      // 获取播放地址
      const playUrl = await getVideoPlayUrl(firstVideo.id)
      console.log('开始播放:', firstVideo.title)
      
      // 模拟观看5分钟后更新播放历史
      setTimeout(async () => {
        await updatePlayHistory({
          videoId: firstVideo.id,
          position: 300,
          deviceType: 'web'
        })
        console.log('播放历史已更新')
      }, 1000)
      
      // 点赞视频
      const likeResult = await toggleLike(firstVideo.id)
      console.log('点赞状态:', likeResult.isLiked)
    }
    
    // 4. 搜索更多内容
    const searchResults = await searchAll({
      keyword: '热门',
      page: 1,
      limit: 10
    })
    
    console.log('搜索到更多内容:', searchResults.total)
    
    return {
      user: authResult.user,
      videos: videos.items,
      searchResults: searchResults.videos
    }
  } catch (error) {
    console.error('完整流程失败:', error)
    throw error
  }
}

// 导出所有示例函数
export const examples = {
  auth: {
    login: loginExample,
    register: registerExample
  },
  videos: {
    getVideos: getVideosExample,
    getVideoDetail: getVideoDetailExample,
    getCategoriesAndTags: getCategoriesAndTagsExample
  },
  actors: {
    getActors: getActorsExample,
    getActorDetail: getActorDetailExample
  },
  user: {
    interaction: userInteractionExample
  },
  search: {
    search: searchExample
  },
  advanced: {
    withRetry: withRetryExample,
    withCache: withCacheExample,
    upload: uploadExample
  },
  complete: {
    userFlow: completeUserFlowExample
  }
}
