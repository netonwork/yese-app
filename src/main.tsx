import './global.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {App} from './App'

const queryClient = new QueryClient()

async function enableMocking() {
	// 根据环境变量决定是否启用MSW
	// 开发环境默认启用，生产环境可通过 VITE_ENABLE_MSW=true 启用
	const shouldEnableMSW = !import.meta.env.PROD || import.meta.env.VITE_ENABLE_MSW === 'true'
	
	if (!shouldEnableMSW) {
		return
	}
	
	// 开发环境默认启用MSW
	console.log('启用MSW模拟服务...')
	
	const {worker} = await import('./mocks/browser')
	return worker.start({
		onUnhandledRequest: 'warn', // 对未处理的请求发出警告
	})
}

const container = document.querySelector('#root')
enableMocking()
	.then(() => {
		if (container) {
			const root = createRoot(container)
			root.render(
				<StrictMode>
					<QueryClientProvider client={queryClient}>
						<ReactQueryDevtools initialIsOpen={false} />
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</QueryClientProvider>
				</StrictMode>
			)
		}
	})
	.catch(error => {
		throw new Error(`Failed to enable mocking: ${error}`)
	})
