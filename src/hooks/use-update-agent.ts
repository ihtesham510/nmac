import { useElevenLabsClient } from '@/api/client'
import type { Models } from '@/lib/types'
import { useMutation } from '@tanstack/react-query'

export function useUpdateAgent(agentId: string) {
	const client = useElevenLabsClient()
	return useMutation({
		mutationKey: ['update_agent'],
		mutationFn: async ({
			first_message,
			prompt,
			temperature,
			model,
			max_duration,
		}: {
			first_message: string
			prompt: string
			temperature: number
			model: Models
			max_duration: number
		}) => {
			const res = await client.conversationalAi.updateAgent(agentId, {
				conversation_config: {
					agent: {
						first_message,
						prompt: {
							prompt,
							llm: model,
							temperature,
						},
					},
					conversation: {
						max_duration_seconds: max_duration,
					},
				},
			})
			return res
		},
	})
}
