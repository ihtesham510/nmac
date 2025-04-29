import { queryOptions } from '@tanstack/react-query'
import { client } from '@/api/client'
import { type ConversationSummaryResponseModel } from 'elevenlabs/api'

export const queries = {
	list_agents: () =>
		queryOptions({
			queryKey: ['list_agents'],
			queryFn: async () => await client.conversationalAi.getAgents(),
		}),
	list_conversations: ({
		agent_id,
		filter,
	}: {
		agent_id?: string
		filter: string[]
	}) =>
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
	get_agent: (id: string) =>
		queryOptions({
			queryKey: ['get_agent', id],
			queryFn: async () => await client.conversationalAi.getAgent(id),
		}),
	get_conversation: (conversationId: string) =>
		queryOptions({
			queryKey: ['get_conversation'],
			queryFn: async () =>
				await client.conversationalAi.getConversation(conversationId),
		}),
	list_phone_no: (agentId?: string) =>
		queryOptions({
			queryKey: ['list_phone_no'],
			queryFn: async () =>
				agentId
					? await client.conversationalAi.getPhoneNumber(agentId)
					: await client.conversationalAi.getPhoneNumbers(),
		}),
}
