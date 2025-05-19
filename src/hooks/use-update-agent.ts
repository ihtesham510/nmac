import { useElevenLabsClient } from '@/api/client'
import { useMutation } from '@tanstack/react-query'
import type { ConversationalConfigApiModelOutput } from 'elevenlabs/api'

export function useUpdateAgent(agentId: string) {
	const client = useElevenLabsClient()
	return useMutation({
		mutationKey: ['update_agent'],
		mutationFn: async (
			conversation_config: ConversationalConfigApiModelOutput,
		) => {
			const res = await client.conversationalAi.updateAgent(agentId, {
				conversation_config: conversation_config as Record<string, unknown>,
			})
			return res
		},
	})
}
