import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

http.route({
	path: '/webhook',
	method: 'POST',
	handler: httpAction(async (ctx, req) => {
		const body = await req.json()
		console.log(body)
		const agent_id = body.data.agent_id
		const cost = body.data.metadata.cost
		await ctx.runMutation(internal.internals.deduct, {
			cost,
			agent_id,
		})
		return new Response(null, { status: 200 })
	}),
})

http.route({
	path: '/webhook',
	method: 'GET',
	handler: httpAction(async _ => {
		return new Response('hello wowlrd', { status: 200 })
	}),
})

export default http
