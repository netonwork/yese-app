import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="hidden md:block bg-slate-900 dark:bg-slate-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 站点信息 */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">夜</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">夜色视频</h3>
                <p className="text-sm text-slate-400">高品质视频平台</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              夜色视频致力于为用户提供高品质的视频内容，涵盖各种类型的精彩视频。
              我们拥有丰富的视频资源库，为您带来极致的观影体验。
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                aria-label="微博"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                aria-label="微信"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-purple-400 transition-colors"
                aria-label="QQ"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white font-semibold mb-4">快速链接</h4>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-slate-400 hover:text-purple-400 transition-colors">
                  关于我们
                </a>
              </li>
              <li>
                <a href="/help" className="text-slate-400 hover:text-purple-400 transition-colors">
                  帮助中心
                </a>
              </li>
              <li>
                <a href="/feedback" className="text-slate-400 hover:text-purple-400 transition-colors">
                  意见反馈
                </a>
              </li>
              <li>
                <a href="/vip" className="text-slate-400 hover:text-purple-400 transition-colors">
                  VIP会员
                </a>
              </li>
              <li>
                <a href="/download" className="text-slate-400 hover:text-purple-400 transition-colors">
                  APP下载
                </a>
              </li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div>
            <h4 className="text-white font-semibold mb-4">联系我们</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">support@yese.tv</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">400-888-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">北京市朝阳区xxx路xxx号</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400 text-sm">
              © 2024 夜色视频. 保留所有权利.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="/privacy" className="text-slate-400 hover:text-purple-400 transition-colors">
                隐私政策
              </a>
              <a href="/terms" className="text-slate-400 hover:text-purple-400 transition-colors">
                服务条款
              </a>
              <a href="/legal" className="text-slate-400 hover:text-purple-400 transition-colors">
                法律声明
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// 移动端站点信息组件（用于用户菜单中）
export const MobileFooterInfo = () => {
  return (
    <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4 px-4 pb-4 bg-white dark:bg-slate-900">
      {/* 站点信息 */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">夜</span>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">夜色视频</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">高品质视频平台</p>
          </div>
        </div>
      </div>

      {/* 快速链接 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <a href="/about" className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          关于我们
        </a>
        <a href="/help" className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          帮助中心
        </a>
        <a href="/feedback" className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          意见反馈
        </a>
        <a href="/download" className="text-sm text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          APP下载
        </a>
      </div>

      {/* 联系方式 */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400">support@yese.tv</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400">400-888-9999</span>
        </div>
      </div>

      {/* 版权信息 */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
        © 2024 夜色视频. 保留所有权利.
      </div>
    </div>
  )
}
