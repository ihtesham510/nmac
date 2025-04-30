import { queryOptions } from '@tanstack/react-query'
import { type ConversationSummaryResponseModel } from 'elevenlabs/api'
import type { ElevenLabsClient } from 'elevenlabs'

export const queries = {
	list_agents: (client: ElevenLabsClient) =>
		queryOptions({
			queryKey: ['list_agents'],
			queryFn: async () => await client.conversationalAi.getAgents(),
		}),
	list_conversations: (
		client: ElevenLabsClient,
		{
			agent_id,
			filter,
		}: {
			agent_id?: string
			filter: string[]
		},
	) =>
		queryOptions({
			queryKey: ['list_conversations', agent_id, filter],
			queryFn: async () => {
				let conversations: ConversationSummaryResponseModel[] = []
				let cursor: string | undefined = undefined
				do {
					const conv = await client.conversationalAi.getConversations({
						agent_id: agent_id,
						page_size: 100,
						cursor: cursor,
					})
					cursor = conv.next_cursor
					conversations = [...conversations, ...conv.conversations]
				} while (cursor)
				conversations = conversations.filter(conv =>
					filter.includes(conv.agent_id),
				)
				return { conversations }
			},
		}),
	get_agent: (client: ElevenLabsClient, id: string) =>
		queryOptions({
			queryKey: ['get_agent', id],
			queryFn: async () => await client.conversationalAi.getAgent(id),
		}),
	get_conversation: (
		client: ElevenLabsClient,
		{
			conversationId,
			enabled,
		}: {
			conversationId: string
			enabled: boolean
		},
	) =>
		queryOptions({
			queryKey: ['get_conversation', conversationId],
			queryFn: async () =>
				await client.conversationalAi.getConversation(conversationId),
			enabled,
		}),
	list_phone_no: (client: ElevenLabsClient, { filter }: { filter: string[] }) =>
		queryOptions({
			queryKey: ['list_phone_no'],
			queryFn: async () => {
				const phone_nos = await client.conversationalAi.getPhoneNumbers()
				if (filter) {
					return phone_nos.filter(
						phone =>
							phone.assigned_agent &&
							filter.includes(phone.assigned_agent.agent_id),
					)
				}
			},
		}),
	list_knoledge_base: (client: ElevenLabsClient) =>
		queryOptions({
			queryKey: ['list_knoledge_base'],
			queryFn: async () => await client.conversationalAi.getKnowledgeBaseList(),
		}),
}
