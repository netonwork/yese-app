import { useState, useEffect } from 'react'
import { ArrowLeft, Smartphone, Lock, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export const RegisterPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [errors, setErrors] = useState<{
    phone?: string
    code?: string
    password?: string
    confirmPassword?: string
  }>({})

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const validatePhone = (phone: string) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const handleSendCode = async () => {
    if (!formData.phone) {
      setErrors(prev => ({ ...prev, phone: '请输入手机号' }))
      return
    }
    
    if (!validatePhone(formData.phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入正确的手机号格式' }))
      return
    }

    setSendingCode(true)
    
    try {
      // 这里调用发送验证码API
      console.log('发送验证码到:', formData.phone)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setCountdown(60)
      setErrors(prev => ({ ...prev, phone: undefined }))
    } catch (error) {
      console.error('发送验证码失败:', error)
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证
    const newErrors: typeof errors = {}
    
    if (!formData.phone) {
      newErrors.phone = '请输入手机号'
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = '请输入正确的手机号格式'
    }
    
    if (!formData.code) {
      newErrors.code = '请输入验证码'
    } else if (formData.code.length !== 6) {
      newErrors.code = '验证码为6位数字'
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length > 0) {
      return
    }
    
    setLoading(true)
    
    try {
      // 这里调用注册API
      console.log('注册数据:', formData)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 注册成功后跳转到首页
      navigate('/')
    } catch (error) {
      console.error('注册失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* 顶部导航 */}
      <header className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold text-white">注册</h1>
        <div className="w-10" /> {/* 占位符保持居中 */}
      </header>

      {/* 主要内容 */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo和标题 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <div className="w-12 h-12 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">加入夜色视频</h2>
            <p className="text-slate-400">创建账号，开启精彩视频之旅</p>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 手机号输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                手机号
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, phone: e.target.value }))
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }))
                  }}
                  placeholder="请输入手机号"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border ${
                    errors.phone ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* 验证码输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setFormData(prev => ({ ...prev, code: value }))
                      if (errors.code) setErrors(prev => ({ ...prev, code: undefined }))
                    }}
                    placeholder="请输入验证码"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border ${
                      errors.code ? 'border-red-500' : 'border-slate-700'
                    } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={sendingCode || countdown > 0}
                  className="px-4 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                >
                  {sendingCode ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : countdown > 0 ? (
                    `${countdown}s`
                  ) : (
                    '发送验证码'
                  )}
                </button>
              </div>
              {errors.code && (
                <p className="mt-1 text-sm text-red-400">{errors.code}</p>
              )}
            </div>

            {/* 密码输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, password: e.target.value }))
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                  }}
                  placeholder="请输入密码（至少6位）"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border ${
                    errors.password ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>

            {/* 确认密码输入 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }}
                  placeholder="请再次输入密码"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-700'
                  } text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  注册中...
                </div>
              ) : (
                '注册'
              )}
            </button>
          </form>

          {/* 用户协议 */}
          <div className="mt-6 text-center text-sm text-slate-400">
            注册即表示同意{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              用户协议
            </button>{' '}
            和{' '}
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              隐私政策
            </button>
          </div>

          {/* 登录链接 */}
          <div className="mt-8 text-center">
            <p className="text-slate-400">
              已有账号？{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
