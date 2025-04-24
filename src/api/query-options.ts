import { queryOptions } from '@tanstack/react-query'
import { client } from '@/api/client'

export const queries = {
	list_agents: () =>
		queryOptions({
			queryKey: ['list_agents'],
			queryFn: async () => await client.conversationalAi.getAgents(),
		}),
	list_conversations: (agentId: string) =>
		queryOptions({
			queryKey: ['list_conversations'],
			queryFn: async () =>
				await client.conversationalAi.getConversations({
					agent_id: agentId,
					page_size: 100,
				}),
		}),
	get_agent: (id: string) =>
		queryOptions({
			queryKey: ['get_agent', id],
			queryFn: async () => await client.conversationalAi.getAgent(id),
		}),
}
