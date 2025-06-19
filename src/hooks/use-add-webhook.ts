import { useElevenLabsClient } from '@/api/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
	GetAgentResponseModel,
	WebhookToolConfigInput,
	ConversationalConfig,
} from '@elevenlabs/elevenlabs-js/api'

export function useAddWebhook(agent: GetAgentResponseModel) {
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['add_webhook'],

		mutationFn: async (config: WebhookToolConfigInput) => {
			const updatedTools = [
				{ ...config, type: 'webhook' } as any,
				...(agent.conversationConfig.agent?.prompt?.tools ?? []),
			]
			const conversational_config: ConversationalConfig = {
				agent: {
					prompt: {
						tools: updatedTools,
					},
				},
			}

			await client.conversationalAi.agents.update(agent.agentId, {
				conversationConfig: conversational_config,
			})
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agentId],
			})
		},
	})
}
