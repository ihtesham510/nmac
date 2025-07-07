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

http.route({
	path: '/forward',
	method: 'POST',
	handler: httpAction(async ctx => {
		try {
			await ctx.runAction(internal.actions.forwardAction)
			return new Response(null, { status: 200 })
		} catch (err) {
			return new Response(null, { status: 500 })
		}
	}),
})

http.route({
	path: '/fallback-forward',
	method: 'POST',
	handler: httpAction(async ctx => {
		try {
			await ctx.runAction(internal.actions.fallbackForwardAction)
			return new Response(null, { status: 200 })
		} catch (err) {
			return new Response(null, { status: 500 })
		}
	}),
})

http.route({
	path: '/voice',
	method: 'POST',
	handler: httpAction(async (_, request) => {
		const PRIMARY_NUMBER = '+61489260701'
		const TIMEOUT_SECONDS = 10

		const formData = await request.formData()
		const from = formData.get('From')
		const to = formData.get('To')

		console.log(`📞 Incoming call from ${from} to ${to}`)

		const twiml = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
        <Dial timeout="${TIMEOUT_SECONDS}" action="https://earnest-anaconda-975.convex.site/call-result" method="POST">
            <Number>${PRIMARY_NUMBER}</Number>
        </Dial>
    </Response>`

		return new Response(twiml, {
			headers: { 'Content-Type': 'text/xml' },
		})
	}),
})

http.route({
	path: '/call-result',
	method: 'POST',
	handler: httpAction(async (_, request) => {
		const BACKUP_NUMBER = '+61 3 4062 7520'

		const formData = await request.formData()
		const dialCallStatus = formData.get('DialCallStatus')
		const from = formData.get('From')

		console.log(`📊 Call result: ${dialCallStatus} from ${from}`)

		let twiml

		if (dialCallStatus === 'no-answer' || dialCallStatus === 'busy') {
			console.log(`🔄 No answer, forwarding to ${BACKUP_NUMBER}`)

			twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
            <Say voice="alice">Please hold while we connect you to another number.</Say>
            <Dial>
                <Number>${BACKUP_NUMBER}</Number>
            </Dial>
        </Response>`
		} else {
			console.log(`✅ Call ${dialCallStatus}`)
			twiml = `<?xml version="1.0" encoding="UTF-8"?>
        <Response></Response>`
		}

		return new Response(twiml, {
			headers: { 'Content-Type': 'text/xml' },
		})
	}),
})

export default http
