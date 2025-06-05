import { useAuth } from '@/context/auth-context'
import { Navigate } from '@tanstack/react-router'
import type { PropsWithChildren } from 'react'

export function ProtectedClientRoute(props: PropsWithChildren) {
	const auth = useAuth()
	if (!auth.isAuthenticated) return <Navigate to='/sign-in' />
	const isUser =
		auth.user && auth.isAuthenticated && auth.type === 'user' && !auth.isLoading
	if (isUser) return <Navigate to='/401' />
	return props.children
}
