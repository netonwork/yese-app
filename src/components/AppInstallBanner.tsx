import { useState } from 'react'
import { Smartphone, X, Download } from 'lucide-react'

export const AppInstallBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-2 right-2 w-20 h-20 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-2 left-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
      
      {/* 关闭按钮 */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-1 -right-1 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-white transition-colors z-20 shadow-lg"
      >
        <X className="w-3 h-3" />
      </button>
      
      <div className="relative z-10 flex items-center gap-3 lg:gap-4">
        {/* 图标 */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-xl lg:rounded-2xl flex items-center justify-center">
            <Smartphone className="w-5 h-5 lg:w-7 lg:h-7" />
          </div>
        </div>
        
        {/* 内容 */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base lg:text-lg font-bold mb-1">
            下载夜色视频 APP
          </h3>
          <p className="text-white/90 text-xs lg:text-sm hidden sm:block">
            更流畅的观看体验，离线缓存，随时随地享受精彩内容
          </p>
          <p className="text-white/90 text-xs sm:hidden">
            更流畅体验，离线缓存
          </p>
        </div>
        
        {/* 下载按钮 */}
        <div className="flex-shrink-0">
          <button className="flex items-center gap-1 lg:gap-2 px-3 py-2 lg:px-6 lg:py-3 bg-white text-purple-600 rounded-lg lg:rounded-xl font-medium hover:bg-white/90 transition-colors shadow-lg text-sm lg:text-base">
            <Download className="w-3 h-3 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">立即下载</span>
            <span className="sm:hidden">下载</span>
          </button>
        </div>
      </div>
    </div>
  )
}
