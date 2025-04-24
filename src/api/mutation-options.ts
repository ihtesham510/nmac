import { type MutationOptions, type QueryClient } from '@tanstack/react-query'
import { client } from '@/api/client'
import type { CreateAgentOptions, CreateAgentReturnOptions } from '@/lib/types'

type MutationFactory<TVariables = any, TData = void> = (
	queryClient: QueryClient,
) => MutationOptions<TData, unknown, TVariables>

export const mutations = {
	create_agent: (queryClient => ({
		mutationKey: ['create_agent'],
		mutationFn: async ({ options }: { options: CreateAgentOptions }) => {
			return await client.conversationalAi.createAgent(options)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['list_agents'] })
		},
	})) satisfies MutationFactory<
		{ options: CreateAgentOptions },
		CreateAgentReturnOptions
	>,

	delete_agent: (queryClient => ({
		mutationKey: ['delete_agent'],
		mutationFn: async ({ agent_id }: { agent_id: string }) => {
			return await client.conversationalAi.deleteAgent(agent_id)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['list_agents'],
			})
		},
	})) satisfies MutationFactory<{ agent_id: string }>,
}
