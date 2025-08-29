import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/components/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { VipPage } from '@/pages/VipPage'
import { VideoListPage } from '@/pages/VideoListPage'
import { CategoryTagsPage } from '@/pages/CategoryTagsPage'
import { SearchPage } from '@/pages/SearchPage'
import { WatchPage } from '@/pages/WatchPage'
import { MyFavoritesPage } from '@/pages/MyFavoritesPage'
import { WatchHistoryPage } from '@/pages/WatchHistoryPage'
import '@/global.css'

function renderError({ error }: FallbackProps) {
	return (
		<div role="alert" className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-900/20">
			<div className="text-center p-8 rounded-xl bg-white dark:bg-slate-800 shadow-lg max-w-md mx-4">
				<h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">出现错误</h2>
				<pre className="text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 p-4 rounded-lg overflow-auto">
					{error.message}
				</pre>
				<button 
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
				>
					刷新页面
				</button>
			</div>
		</div>
	)
}

export function App() {
	// 设置默认深色模式
	if (typeof document !== 'undefined') {
		document.documentElement.classList.add('dark')
	}

	return (
		<ErrorBoundary fallbackRender={renderError}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/forgot-password" element={<ForgotPasswordPage />} />
					<Route path="/vip" element={<VipPage />} />
					<Route path="/videos" element={<VideoListPage />} />
					<Route path="/category/:categoryId" element={<CategoryTagsPage />} />
					<Route path="/search" element={<SearchPage />} />
					<Route path="/watch/:videoId" element={<WatchPage />} />
					<Route path="/favorites" element={<MyFavoritesPage />} />
					<Route path="/history" element={<WatchHistoryPage />} />
				</Routes>
			</BrowserRouter>
		</ErrorBoundary>
	)
}
