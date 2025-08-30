import {delay, HttpResponse, http} from 'msw'
import fruits from './data/fruits.json' with {type: 'json'}
import categories from './data/categories.json' with {type: 'json'}
import vipData from './data/vip.json'
import shareData from './data/share.json'

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
	}),

	// VIP相关API
	http.get('/api/vip/plans', async () => {
		await delay(300) // 模拟网络延迟
		return HttpResponse.json({
			plans: vipData.plans,
			total: vipData.plans.length
		})
	}),

	http.get('/api/vip/features', async () => {
		await delay(200)
		return HttpResponse.json({
			features: vipData.features,
			total: vipData.features.length
		})
	}),

	http.get('/api/vip/status', async () => {
		await delay(200)
		// 模拟用户VIP状态
		return HttpResponse.json({
			isVip: false,
			autoRenew: false
		})
	}),

	http.post('/api/vip/orders', async ({ request }) => {
		await delay(500)
		const body = await request.json() as any
		
		// 模拟创建订单
		const order = {
			id: `order_${Date.now()}`,
			userId: 'user_123',
			planId: body.planId,
			plan: vipData.plans.find(p => p.id === body.planId),
			amount: vipData.plans.find(p => p.id === body.planId)?.price || 0,
			paymentMethod: body.paymentMethod,
			status: 'pending',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}

		return HttpResponse.json({
			order,
			paymentInfo: {
				orderNo: order.id,
				paymentUrl: `https://pay.example.com/${order.id}`,
				qrCode: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
			}
		})
	}),

	// 分享数据
	http.get('/api/share/data', async () => {
		await delay(200)
		return HttpResponse.json({
			config: shareData.config,
			stats: shareData.stats,
			inviteUrl: shareData.inviteUrl
		})
	}),

	// 邀请点击记录
	http.post('/api/share/click', async () => {
		await delay(200)
		return HttpResponse.json({ success: true })
	}),

	// 邀请收益记录
	http.get('/api/share/earnings', async () => {
		await delay(200)
		return HttpResponse.json({
			data: shareData.earnings,
			total: shareData.earnings.length,
			page: 1,
			limit: 20
		})
	})
]
