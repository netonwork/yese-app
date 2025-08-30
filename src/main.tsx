import './global.css'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {App} from './App'

const queryClient = new QueryClient()

async function enableMocking() {
	// 只在开发环境且启用MSW时才加载mock
	if (import.meta.env.PROD) {
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
