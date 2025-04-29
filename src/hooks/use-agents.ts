import { useAuth } from '@/context/auth-context'
import type { Agent } from '@/lib/types'
import { api } from 'convex/_generated/api'
import { useConvex } from 'convex/react'
import { useState, useEffect, useMemo } from 'react'

export function useAgents() {
	const auth = useAuth()
	const convex = useConvex()
	const isUser = auth.isAuthenticated && auth.user && auth.type === 'user'
	const isClient = auth.isAuthenticated && auth.client && auth.type === 'client'

	const [agents, setAgents] = useState<Agent[]>([])

	useEffect(() => {
		;(async () => {
			if (isClient) {
				const agents = await Promise.all(
					auth.client!.assigned_Agents!.map(
						async agent =>
							await convex.query(api.agents.getAgent, { agentId: agent }),
					),
				)
				setAgents(agents)
			} else if (isUser) {
				const agents = await convex.query(api.agents.getAgents, {
					userId: auth.user!._id,
				})
				if (agents) {
					setAgents(agents)
				}
			}
		})()
	}, [isClient, isUser, auth.client, auth.user])

	return useMemo(() => agents.filter(agent => !!agent), [agents])
}
