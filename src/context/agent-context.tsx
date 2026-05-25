import type { GetAgentResponseModel } from '@elevenlabs/elevenlabs-js/api'
import type { UseQueryResult } from '@tanstack/react-query'
import { createContext, type PropsWithChildren, useContext } from 'react'
import type { GetAgentByIDReturnType } from '@/lib/types'

type AgentResponse = UseQueryResult<GetAgentResponseModel | null, Error>

interface AgentContext {
	agent: AgentResponse
	isLoading: boolean
	agentData: GetAgentByIDReturnType
}

export const agentContext = createContext<AgentContext | null>(null)

export const AgentContextProvider = ({
	children,
	...props
}: PropsWithChildren & AgentContext) => {
	return (
		<agentContext.Provider value={{ ...props }}>
			{children}
		</agentContext.Provider>
	)
}

export function useAgentContext() {
	const ctx = useContext(agentContext)
	if (!ctx)
		throw new Error('Agent Context must be used inside of AgentContextProvider')
	return ctx
}
