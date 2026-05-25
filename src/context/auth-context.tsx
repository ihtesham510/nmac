import { useLocalStorage } from '@mantine/hooks'
import { api } from 'convex/_generated/api'
import type { Id } from 'convex/_generated/dataModel'
import { useMutation } from 'convex/react'
import {
	createContext,
	type PropsWithChildren,
	useCallback,
	useContext,
} from 'react'
import { toast } from 'sonner'
import { useQuery } from '@/cache/useQuery'
import type { ArgsSignIn, ArgsUser, Client, User } from '@/lib/types'
import { getPercentageOfCredits } from '@/lib/utils'

type UserType = 'client' | 'user' | null

export const authContext = createContext<{
	user: User | undefined
	client:
		| (Client & { low_credits: boolean; has_subscription: boolean })
		| undefined
	logOut: () => void
	signUp: (params: ArgsUser) => void
	type: UserType
	isAuthenticated: boolean
	isUnauthenticated: boolean
	isLoading: boolean
	api_key?: string
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
	}, [setToken])

	const signUp = useCallback(
		async (params: ArgsUser) => {
			const id = await registerUser(params)
			setToken(id)
		},
		[setToken, registerUser],
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
			} catch (_err) {
				toast.error('Error While Sigging in.')
			}
		},
		[sign_in, setToken],
	)

	const isLoading = user === undefined || client === undefined
	const isUnauthenticated = user === null && client === null
	const isAuthenticated = !!user || !!client
	const api_key = user?.elevenLabs_api_key ?? client?.api_key
	const has_subscription = !!client?.subscription
	const low_credits = !!(
		client?.subscription &&
		getPercentageOfCredits(
			client.subscription.total_credits,
			client.subscription.remaining_credits,
		) < 5
	)

	return (
		<authContext.Provider
			value={{
				user,
				client: client
					? { ...client, low_credits, has_subscription }
					: undefined,
				type,
				isAuthenticated,
				isUnauthenticated,
				isLoading,
				api_key,
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
