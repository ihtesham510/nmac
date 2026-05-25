import type {
	ConversationalConfig,
	GetAgentResponseModel,
	WebhookToolConfigInput,
} from '@elevenlabs/elevenlabs-js/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useElevenLabsClient } from '@/api/client'

export function useAddWebhook(agent: GetAgentResponseModel) {
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['add_webhook'],

		mutationFn: async (config: WebhookToolConfigInput) => {
			const updatedTools = [
				// biome-ignore lint/suspicious/noExplicitAny: <Tools can be of type any>
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
