import {
	createContext,
	useContext,
	useEffect,
	type PropsWithChildren,
} from 'react'
import type { Agent } from '@/lib/types'
import {
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { useElevenLabsClient } from '@/api/client'
import { useAgents } from '@/hooks/use-agents'
import type { GetAgentResponseModel } from 'elevenlabs/api'
import React from 'react'

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
		queries.get_agent(client, { id: selectedAgent?.agentId, enabled: false }),
	)
	useEffect(() => {
		if (agents && agents.length > 0) {
			setSelectedAgent(agents[0])
		}
	}, [agents])

	useEffect(() => {
		if (selectedAgent) {
			agent.refetch()
			queryClient.invalidateQueries({ queryKey: [selectedAgent.agentId] })
		}
	}, [selectedAgent])

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
