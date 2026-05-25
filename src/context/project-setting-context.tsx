import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api'
import {
	type UseQueryResult,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query'
import React, {
	createContext,
	type PropsWithChildren,
	useContext,
	useEffect,
} from 'react'
import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { useAgents } from '@/hooks/use-agents'
import type { Agent } from '@/lib/types'

interface ProjectSettingsContext {
	selectedAgent: Agent | undefined
	agents: Agent[]
	setSelectedAgent: (agent: Agent) => void
	agent: UseQueryResult<GetAgentResponseModel | null, Error>
}

export const projectSettingsContext =
	createContext<ProjectSettingsContext | null>(null)

export function ProjectSettingContextProvider({ children }: PropsWithChildren) {
	const agents = useAgents()
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	const [selectedAgent, setSelectedAgent] = React.useState<Agent | undefined>(
		undefined,
	)
	const agent = useQuery(
		queries.get_agent(client, {
			id: selectedAgent?.agentId,
			enabled: !!selectedAgent,
		}),
	)
	useEffect(() => {
		if (agents && agents.length > 0) {
			setSelectedAgent(agents[0])
		}
	}, [agents])

	useEffect(() => {
		if (selectedAgent) {
			agent.refetch()
			queryClient.invalidateQueries({
				queryKey: [selectedAgent.agentId, 'get_agent'],
			})
		}
	}, [selectedAgent, queryClient.invalidateQueries, agent.refetch])

	return (
		<projectSettingsContext.Provider
			value={{ setSelectedAgent, selectedAgent, agents, agent }}
		>
			{children}
		</projectSettingsContext.Provider>
	)
}

export function useProjetSettings() {
	const ctx = useContext(projectSettingsContext)
	if (!ctx) throw new Error('project settings context is not set.')
	return ctx
}
