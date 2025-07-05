'use node'

import { internalAction } from './_generated/server'
import twilio from 'twilio'

export const forwardAction = internalAction({
	async handler() {
		const twiml = new twilio.twiml.VoiceResponse()
		const dial = twiml.dial({
			timeout: 15,
			action: '/fallback-forward',
		})
		dial.number('+61488274266')
	},
})

export const fallbackForwardAction = internalAction({
	async handler() {
		const twiml = new twilio.twiml.VoiceResponse()
		const dial = twiml.dial()
		dial.number('+61340627520')
	},
})
