import { useAuth } from '@/context/auth-context'
import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function ProtectedRoute({ children }: PropsWithChildren) {
	const auth = useAuth()
	if (!auth.isAuthenticated.authenticated) return <Navigate to='/sign-in' />
	return children
}
