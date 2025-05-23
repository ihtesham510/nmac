import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ElevenLabsClient } from 'elevenlabs'
import type {
	BodyCreateTextDocumentV1ConvaiKnowledgeBaseTextPost,
	BodyCreateUrlDocumentV1ConvaiKnowledgeBaseUrlPost,
	GetAgentResponseModel,
} from 'elevenlabs/api'
import { useUpdateAgent } from './use-update-agent'
import { toast } from 'sonner'

export function useKnowledgeBase(
	client: ElevenLabsClient,
	agent: GetAgentResponseModel,
) {
	const updateAgent = useUpdateAgent(agent.agent_id)
	const queryClient = useQueryClient()
	const addKnowledgeBase = useMutation({
		mutationKey: ['add_knowledge_base'],
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agent_id],
			})
			toast.success('Document added successfully')
		},
		async onError() {
			await queryClient.invalidateQueries({ queryKey: [agent.agent_id] })
			toast.error('Error while adding document.')
		},
		mutationFn: async ({
			url,
			text,
		}: {
			url?: BodyCreateUrlDocumentV1ConvaiKnowledgeBaseUrlPost
			text?: BodyCreateTextDocumentV1ConvaiKnowledgeBaseTextPost
		}) => {
			if (url) {
				const res =
					await client.conversationalAi.createKnowledgeBaseUrlDocument(url)
				await updateAgent.mutateAsync({
					agent: {
						prompt: {
							knowledge_base: [
								{
									id: res.id,
									name: res.name,
									type: 'url',
								},
								...(agent.conversation_config.agent?.prompt?.knowledge_base ??
									[]),
							],
						},
					},
				})
			}
			if (text) {
				const res =
					await client.conversationalAi.createKnowledgeBaseTextDocument(text)
				await updateAgent.mutateAsync({
					agent: {
						prompt: {
							knowledge_base: [
								{
									id: res.id,
									name: res.name,
									type: 'text',
								},
								...(agent.conversation_config.agent?.prompt?.knowledge_base ??
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
				agent.conversation_config.agent?.prompt?.knowledge_base
			await updateAgent.mutateAsync({
				agent: {
					prompt: {
						knowledge_base: knowledgebase
							? knowledgebase.filter(doc => doc.id !== id)
							: [],
					},
				},
			})
			await client.conversationalAi.deleteKnowledgeBaseDocument(id)
		},
		async onSuccess() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agent_id],
			})

			toast.success('Knowledge Base Deleted Successfully')
		},
		async onError() {
			await queryClient.invalidateQueries({
				queryKey: ['get_agent', agent.agent_id],
			})
			toast.error('Error while deleting knowledgebase.')
		},
	})

	return { addKnowledgeBase, deleteKnowledgeBase }
}
