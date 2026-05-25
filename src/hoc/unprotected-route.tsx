import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { LoaderComponent } from '@/components/loader'
import { useAuth } from '@/context/auth-context'

export function UnProtectedRoute({ children }: PropsWithChildren) {
	const { isLoading, isUnauthenticated, client } = useAuth()

	if (isLoading) return <LoaderComponent />
	if (isUnauthenticated) return children

	if (client) {
		if (client.low_credits) return children
		if (!client.has_subscription) return children
	}

	return <Navigate to='/dashboard' />
}
