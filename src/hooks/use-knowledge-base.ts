import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api'
import { useUpdateAgent } from './use-update-agent'
import { toast } from 'sonner'

export function useKnowledgeBase(
	client: ElevenLabsClient,
	agent: GetAgentResponseModel,
) {
	const updateAgent = useUpdateAgent(agent.agentId)
	const queryClient = useQueryClient()
	const addKnowledgeBase = useMutation({
		mutationKey: ['add_knowledge_base'],
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agentId],
			})
			toast.success('Document added successfully')
		},
		async onError() {
			await queryClient.invalidateQueries({ queryKey: [agent.agentId] })
			toast.error('Error while adding document.')
		},
		mutationFn: async ({
			url,
			text,
		}: {
			url?: {
				name?: string
				url: string
			}
			text?: {
				name?: string
				text: string
			}
		}) => {
			if (url) {
				const res =
					await client.conversationalAi.knowledgeBase.documents.createFromUrl(
						url,
					)
				await updateAgent.mutateAsync({
					agent: {
						prompt: {
							knowledgeBase: [
								{
									id: res.id,
									name: res.name,
									type: 'url',
								},
								...(agent.conversationConfig.agent?.prompt?.knowledgeBase ??
									[]),
							],
						},
					},
				})
			}
			if (text) {
				const res =
					await client.conversationalAi.knowledgeBase.documents.createFromText(
						text,
					)
				await updateAgent.mutateAsync({
					agent: {
						prompt: {
							knowledgeBase: [
								{
									id: res.id,
									name: res.name,
									type: 'text',
								},
								...(agent.conversationConfig.agent?.prompt?.knowledgeBase ??
									[]),
							],
						},
					},
				})
			}
			return null
		},
	})

	const deleteKnowledgeBase = useMutation({
		mutationKey: ['delete_knowledgeBase'],
		mutationFn: async (id: string) => {
			const knowledgebase =
				agent.conversationConfig.agent?.prompt?.knowledgeBase
			await updateAgent.mutateAsync({
				agent: {
					prompt: {
						knowledgeBase: knowledgebase
							? knowledgebase.filter(doc => doc.id !== id)
							: [],
					},
				},
			})
			await client.conversationalAi.knowledgeBase.documents.delete(id)
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agentId],
			})

			toast.success('Knowledge Base Deleted Successfully')
		},
		async onError() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agentId],
			})
			toast.error('Error while deleting knowledgebase.')
		},
	})

	return { addKnowledgeBase, deleteKnowledgeBase }
}
