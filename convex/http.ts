import { httpRouter } from 'convex/server'
import { httpAction, query } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

http.route({
	path: '/webhook',
	method: 'GET',
	handler: httpAction(async (ctx, req) => {
		return new Response(null, {
			status: 200,
		})
	}),
})

export default http
