import { useAuth } from '@/context/auth-context'
import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function ProtectedUserRoute({ children }: PropsWithChildren) {
	const auth = useAuth()
	const isUser = !auth.isLoading && auth.isAuthenticated && auth.type === 'user'
	if (!isUser) return <Navigate to='/dashboard/505' />
	return children
}
