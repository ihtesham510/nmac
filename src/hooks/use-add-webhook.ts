import { useElevenLabsClient } from '@/api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
	GetAgentResponseModel,
	WebhookToolConfigInput,
	ConversationalConfigApiModelInput,
} from 'elevenlabs/api'

export function useAddWebhook(agent: GetAgentResponseModel) {
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['add_webhook'],

		mutationFn: async (config: WebhookToolConfigInput) => {
			const updatedTools = [
				{ ...config, type: 'webhook' } as any,
				...(agent.conversation_config.agent?.prompt?.tools ?? []),
			]
			const conversational_config: ConversationalConfigApiModelInput = {
				agent: {
					prompt: {
						tools: updatedTools,
					},
				},
			}

			await client.conversationalAi.updateAgent(agent.agent_id, {
				conversation_config: conversational_config as Record<string, string>,
			})
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agent_id],
			})
		},
	})
}
