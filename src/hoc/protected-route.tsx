import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'
import { LoaderComponent } from '@/components/loader'
import { useAuth } from '@/context/auth-context'

export function ProtectedRoute({ children }: PropsWithChildren) {
	const { isLoading, isUnauthenticated, client } = useAuth()

	if (isLoading) return <LoaderComponent />
	if (isUnauthenticated) return <Navigate to='/sign-in' />

	if (client) {
		if (client.low_credits) return <Navigate to='/422' />
		if (!client.has_subscription) return <Navigate to='/403' />
	}

	return children
}
