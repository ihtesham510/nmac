import { LoaderComponent } from '@/components/loader'
import { useAuth } from '@/context/auth-context'
import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function UnProtectedRoute({ children }: PropsWithChildren) {
	const auth = useAuth()
	if (auth.isLoading) return <LoaderComponent />
	if (auth.isAuthenticated) {
		return <Navigate to='/dashboard' />
	}
	return children
}
