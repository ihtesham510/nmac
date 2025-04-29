import { useQuery, useMutation } from 'convex/react'
import type { Client, ArgsUser, User, ArgsSignIn } from '@/lib/types'
import { useLocalStorage } from '@mantine/hooks'
import { api } from 'convex/_generated/api'
import {
	createContext,
	useCallback,
	useContext,
	type PropsWithChildren,
} from 'react'
import type { Id } from 'convex/_generated/dataModel'
import { toast } from 'sonner'

type UserType = 'client' | 'user' | null

export const authContext = createContext<{
	user: User | undefined
	client: Client | undefined
	logOut: () => void
	signUp: (params: ArgsUser) => void
	type: UserType
	isAuthenticated: boolean
	isUnauthenticated: boolean
	isLoading: boolean
	signIn: (data: ArgsSignIn) => void
} | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
	const [token, setToken] = useLocalStorage<string | undefined>({
		key: 'token',
		defaultValue: undefined,
	})
	const user = useQuery(api.user.authenticate, {
		id: token === 'undefined' ? undefined : (token as Id<'user'>),
	})
	const client = useQuery(api.client.authenticate, {
		id: token === 'undefined' ? undefined : (token as Id<'client'>),
	})

	const sign_in = useMutation(api.user.signIn)
	const registerUser = useMutation(api.user.registerUser)

	const logOut = useCallback(() => {
		setToken(undefined)
	}, [token])

	const signUp = useCallback(
		async (params: ArgsUser) => {
			const id = await registerUser(params)
			console.log(id)
			setToken(id)
		},
		[token],
	)

	function getType(): UserType {
		if (user) return 'user'
		if (client) return 'client'
		return null
	}
	const type = getType()

	const signIn = useCallback(
		async (data: ArgsSignIn) => {
			try {
				const id = await sign_in(data)
				if (id) {
					toast.success('Signed In Successfully')
					setToken(id as string)
				} else {
					toast.error('Error While Sigging in.')
				}
			} catch (err) {
				toast.error('Error While Sigging in.')
			}
		},
		[token],
	)

	const isLoading = user === undefined || client === undefined
	const isUnauthenticated = user === null && client === null
	const isAuthenticated = !!user || !!client

	return (
		<authContext.Provider
			value={{
				user,
				client,
				type,
				isAuthenticated,
				isUnauthenticated,
				isLoading,
				logOut,
				signUp,
				signIn,
			}}
		>
			{children}
		</authContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(authContext)
	if (!ctx)
		throw new Error('Did you forgot to add auth provider in your main.tsx file')
	return ctx
}

export type Auth = ReturnType<typeof useAuth>
