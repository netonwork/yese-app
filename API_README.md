# Video App API 文档

这是一个完整的视频应用API系统，包含认证、视频管理、演员信息、用户行为、搜索等功能模块。

## 项目结构

```
src/
├── types/              # 类型定义
│   ├── index.ts        # 统一导出
│   ├── common.ts       # 通用类型
│   ├── auth.ts         # 认证相关类型
│   ├── video.ts        # 视频相关类型
│   ├── actor.ts        # 演员相关类型
│   └── user.ts         # 用户相关类型
├── api/                # API函数
│   ├── index.ts        # 统一导出和工具函数
│   ├── client.ts       # HTTP客户端
│   ├── auth.ts         # 认证API
│   ├── videos.ts       # 视频API
│   ├── actors.ts       # 演员API
│   ├── user.ts         # 用户行为API
│   ├── search.ts       # 搜索API
│   └── examples.ts     # 使用示例
└── hooks/              # React Query Hooks (待实现)
```

## 核心特性

### 🔒 类型安全
- 使用 Valibot 进行运行时类型验证
- 完整的 TypeScript 类型定义
- 请求和响应数据自动验证

### 🔄 自动Token管理
- 自动刷新过期的访问令牌
- 并发请求时防止重复刷新
- Token失效时自动清理

### 🚀 高级功能
- 请求重试机制
- 响应缓存
- 文件上传进度
- 批量请求处理

### 📱 多端支持
- 响应式设计数据结构
- 设备类型识别
- 跨平台兼容

## API 模块

### 1. 认证模块 (auth.ts)

```typescript
import { login, register, getCurrentUser, logout } from '@/api'

// 用户登录
const authResult = await login({
  username: 'demo',
  password: 'password123'
})

// 用户注册
const registerResult = await register({
  username: 'newuser',
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123'
})

// 获取当前用户信息
const user = await getCurrentUser()

// 用户登出
await logout()
```

**包含功能：**
- ✅ 用户登录/注册
- ✅ Token刷新
- ✅ 用户资料管理
- ✅ 密码修改
- ✅ 邮箱验证
- ✅ 头像上传
- ✅ 会话管理

### 2. 视频模块 (videos.ts)

```typescript
import { getVideos, getVideo, getVideoPlayUrl } from '@/api'

// 获取视频列表
const videos = await getVideos({
  categoryId: 'action',
  tags: ['hot', 'hd'],
  actors: ['actor-001'],
  page: 1,
  limit: 20,
  sortBy: 'popular'
})

// 获取视频详情
const videoDetail = await getVideo('video-123')

// 获取播放地址
const playUrl = await getVideoPlayUrl('video-123')
```

**包含功能：**
- ✅ 视频列表查询（支持多维度筛选）
- ✅ 视频详情获取
- ✅ M3U8播放地址获取
- ✅ 多码率支持
- ✅ 分类和标签管理
- ✅ 推荐算法
- ✅ 统计信息

### 3. 演员模块 (actors.ts)

```typescript
import { getActors, getActor, getActorVideos } from '@/api'

// 获取演员列表
const actors = await getActors({
  keyword: '美女',
  nationality: '日本',
  tags: ['新人'],
  sortBy: 'popular'
})

// 获取演员详情
const actorDetail = await getActor('actor-123')

// 获取演员作品
const actorVideos = await getActorVideos('actor-123', {
  sortBy: 'latest',
  limit: 10
})
```

**包含功能：**
- ✅ 演员信息管理
- ✅ 演员搜索和筛选
- ✅ 作品关联
- ✅ 合作关系分析
- ✅ 相似演员推荐
- ✅ 关注功能

### 4. 用户行为模块 (user.ts)

```typescript
import { 
  updatePlayHistory, 
  toggleFavorite, 
  toggleLike,
  createComment 
} from '@/api'

// 更新播放历史
await updatePlayHistory({
  videoId: 'video-123',
  position: 300, // 5分钟
  deviceType: 'web'
})

// 收藏/取消收藏
const favoriteResult = await toggleFavorite({
  videoId: 'video-123'
})

// 点赞/取消点赞
const likeResult = await toggleLike('video-123')

// 发表评论
const comment = await createComment({
  videoId: 'video-123',
  content: '很棒的视频！'
})
```

**包含功能：**
- ✅ 播放历史记录
- ✅ 收藏系统（支持文件夹）
- ✅ 点赞和评分
- ✅ 评论系统
- ✅ VIP订单管理
- ✅ 用户统计

### 5. 搜索模块 (search.ts)

```typescript
import { 
  searchAll, 
  getSearchSuggestions, 
  getHotKeywords 
} from '@/api'

// 全局搜索
const searchResults = await searchAll({
  keyword: '美女',
  type: 'all',
  page: 1,
  limit: 20
})

// 获取搜索建议
const suggestions = await getSearchSuggestions('美')

// 获取热门关键词
const hotKeywords = await getHotKeywords({ limit: 10 })
```

**包含功能：**
- ✅ 全文搜索
- ✅ 分类搜索（视频/演员/标签）
- ✅ 搜索建议和自动完成
- ✅ 热门关键词
- ✅ 搜索历史
- ✅ 高级搜索

## 高级功能

### 重试机制

```typescript
import { withRetry, getVideos } from '@/api'

const videos = await withRetry(
  () => getVideos({ page: 1 }),
  {
    maxRetries: 3,
    delay: 1000,
    backoff: true
  }
)
```

### 缓存机制

```typescript
import { withCache, getCategories } from '@/api'

const categories = await withCache(
  'categories',
  () => getCategories(),
  10 * 60 * 1000 // 缓存10分钟
)
```

### 文件上传

```typescript
import { uploadFile } from '@/api'

const result = await uploadFile('/auth/avatar', file, {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png'],
  onProgress: (progress) => {
    console.log(`上传进度: ${progress}%`)
  }
})
```

### 批量请求

```typescript
import { batchRequest, getVideo } from '@/api'

const videoIds = ['video-1', 'video-2', 'video-3']
const requests = videoIds.map(id => () => getVideo(id))

const results = await batchRequest(requests, {
  concurrency: 3,
  onProgress: (completed, total) => {
    console.log(`进度: ${completed}/${total}`)
  }
})
```

## 环境配置

### 环境变量

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

### API客户端配置

```typescript
// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const API_TIMEOUT = 30000 // 30秒超时
```

## 错误处理

### 统一错误处理

```typescript
import { ApiError } from '@/api'

try {
  const videos = await getVideos()
} catch (error) {
  if (error instanceof ApiError) {
    console.error('API错误:', error.message)
    console.error('状态码:', error.status)
    console.error('错误代码:', error.code)
  }
}
```

### 常见错误码

- `401` - 未授权（需要登录）
- `403` - 禁止访问（需要VIP）
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器内部错误

## 数据结构

### 视频对象

```typescript
interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  streamUrl: string // M3U8地址
  duration: string
  viewCount: number
  isVip: boolean
  
  // 关联信息
  categoryId: string
  categoryName: string
  tags: string[]
  tagNames: string[]
  actors: string[]
  actorNames: string[]
  
  // 元数据
  resolution?: string
  fileSize?: number
  qualities?: VideoQuality[]
  
  createdAt: string
  updatedAt: string
}
```

### 演员对象

```typescript
interface Actor {
  id: string
  name: string
  slug: string
  avatar?: string
  bio?: string
  birthDate?: string
  nationality?: string
  videoCount: number
  isPopular: boolean
  
  // 统计信息
  stats?: {
    avgRating: number
    totalLikes: number
    totalFavorites: number
  }
  
  createdAt: string
  updatedAt: string
}
```

### 分页响应

```typescript
interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
```

## 最佳实践

### 1. 使用TypeScript类型

```typescript
import type { Video, Actor, PaginatedResponse } from '@/types'

const handleVideos = (videos: PaginatedResponse<Video>) => {
  videos.items.forEach(video => {
    // TypeScript会提供完整的类型提示
    console.log(video.title)
  })
}
```

### 2. 错误边界处理

```typescript
const fetchVideoSafely = async (id: string) => {
  try {
    return await getVideo(id)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null // 视频不存在
    }
    throw error // 其他错误继续抛出
  }
}
```

### 3. 合理使用缓存

```typescript
// 频繁访问的数据使用缓存
const categories = await withCache('categories', getCategories, 30 * 60 * 1000)

// 用户相关数据不要缓存太久
const user = await withCache('current-user', getCurrentUser, 5 * 60 * 1000)
```

### 4. 分页数据处理

```typescript
const loadMoreVideos = async (page: number) => {
  const result = await getVideos({ page, limit: 20 })
  
  if (result.hasMore) {
    // 还有更多数据，可以继续加载
    console.log(`还有 ${result.total - page * 20} 个视频`)
  }
  
  return result.items
}
```

## 开发调试

### 查看API调用

```typescript
// 在浏览器控制台中
import { examples } from '@/api/examples'

// 测试登录
await examples.auth.login()

// 测试获取视频
await examples.videos.getVideos()

// 测试完整流程
await examples.complete.userFlow()
```

### Mock数据

项目使用MSW进行API模拟，开发时会自动使用mock数据。

## 部署说明

### 生产环境配置

```env
# .env.production
VITE_API_BASE_URL=https://api.yourdomain.com
```

### API兼容性

所有API接口都设计为与你的backend项目兼容，特别是认证相关的接口完全遵循现有的token机制。

## 总结

这套API系统提供了：

- **29个核心接口** 覆盖所有业务需求
- **完整的类型定义** 确保开发时的类型安全
- **自动化的错误处理** 统一的错误处理机制
- **高级功能支持** 重试、缓存、批量请求等
- **详细的使用示例** 快速上手和参考

所有API都经过精心设计，既保证了功能的完整性，又保持了良好的可维护性和扩展性。
