import {delay, HttpResponse, http} from 'msw'
import fruits from './data/fruits.json' with {type: 'json'}
import categories from './data/categories.json' with {type: 'json'}

export const handlers = [
	http.get('/fruits', async () => {
		await delay('real')
		return HttpResponse.json(fruits)
	}),

	// 分类相关API
	http.get('/api/categories', async () => {
		await delay(200) // 模拟网络延迟
		return HttpResponse.json(categories)
	}),

	http.get('/api/categories/:id', async ({ params }) => {
		await delay(200)
		const { id } = params
		const category = categories.find(cat => cat.id === id)
		
		if (!category) {
			return HttpResponse.json(
				{ error: 'Category not found' },
				{ status: 404 }
			)
		}
		
		return HttpResponse.json(category)
	})
]
