import { useQuery } from '@/cache/useQuery'
import { useAuth } from '@/context/auth-context'
import { api } from 'convex/_generated/api'

export function useAgents() {
	const auth = useAuth()
	return (
		useQuery(api.agents.getAgents, {
			userId: auth.user?._id,
			agents: auth.client?.assigned_Agents,
		}) ?? []
	)
}
