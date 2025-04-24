import { queryOptions } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { client } from '@/api/client'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'

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
	authenticate_client: (id: string | undefined) =>
		queryOptions(
			convexQuery(api.client.authenticate, {
				id: id ? (id as Id<'client'>) : undefined,
			}),
		),
	authenticate_user: (id: string | undefined) =>
		queryOptions(
			convexQuery(api.user.authenticate, {
				id: id ? (id as Id<'user'>) : undefined,
			}),
		),
	get_clients: (id: Id<'user'>) =>
		queryOptions(
			convexQuery(api.client.listClients, {
				id,
			}),
		),
}
