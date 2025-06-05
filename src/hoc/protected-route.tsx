import { LoaderComponent } from '@/components/loader'
import { useAuth } from '@/context/auth-context'
import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function ProtectedRoute({ children }: PropsWithChildren) {
	const auth = useAuth()
	if (auth.isLoading) return <LoaderComponent />
	if (!auth.isAuthenticated) return <Navigate to='/sign-in' />
	if (
		auth.isAuthenticated &&
		auth.type === 'client' &&
		auth.client?.low_credits
	)
		return <Navigate to='/422' />
	return children
}
