import { httpRouter } from 'convex/server'
import { httpAction } from './_generated/server'
import { internal } from './_generated/api'

const http = httpRouter()

http.route({
	path: '/webhook',
	method: 'POST',
	handler: httpAction(async (ctx, req) => {
		const header = req.headers.get('ElevenLabs-Signature')
		const timestamp = header?.split(',').find(e => e.startsWith('t='))
		const signature = header?.split(',').find(e => e.startsWith('v0='))
		if (timestamp && signature) {
			const body = await req.json()
			const agent_id = body.data.agent_id
			const cost = body.data.metadata.cost
			await ctx.runMutation(internal.internals.deduct, {
				cost,
				agent_id,
			})
			return new Response(null, { status: 200 })
		}

		return new Response(null, { status: 401 })
	}),
})

export default http
