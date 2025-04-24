import { queries } from '@/api/query-options'
import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryResult,
} from '@tanstack/react-query'
import type { Client, ArgsUser, User, ArgsSignIn } from '@/lib/types'
import { useLocalStorage } from '@mantine/hooks'
import { api } from 'convex/_generated/api'
import {
	createContext,
	useCallback,
	useContext,
	type PropsWithChildren,
} from 'react'
import { useConvexMutation } from '@convex-dev/react-query'
import { toast } from 'sonner'

type UserType = 'client' | 'user' | null

type IsAuthenticated = { authenticated: boolean; type: UserType }

export const authContext = createContext<{
	user: UseQueryResult<User>
	client: UseQueryResult<Client>
	logOut: () => void
	signUp: (params: ArgsUser) => void
	prefetch: () => Promise<void>
	isAuthenticated: IsAuthenticated
	signIn: (data: ArgsSignIn) => void
} | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
	const queryclient = useQueryClient()
	const [token, setToken] = useLocalStorage<string | undefined>({
		key: 'token',
		defaultValue: undefined,
	})
	const user = useQuery(queries.authenticate_user(token))
	const client = useQuery(queries.authenticate_client(token))
	const sign_in = useMutation({
		mutationFn: useConvexMutation(api.user.signIn),
	})

	const registerUser = useMutation({
		mutationFn: useConvexMutation(api.user.registerUser),
	})

	const logOut = useCallback(() => {
		setToken(undefined)
	}, [token])

	const signUp = useCallback(
		(params: ArgsUser) => {
			registerUser.mutate(params, {
				onSuccess(data) {
					if (!data) return toast.error('Error While Singing In')
					toast.success('Successfully Signed In')
					setToken(data)
				},
				onError() {
					toast.error('Error While Singing In')
				},
			})
		},
		[token],
	)

	const isUser = user.data && !user.isLoading && !user.isError
	const isClient = client.data && !client.isLoading && !client.isError

	function getType(): UserType {
		if (isUser) return 'user'
		if (isClient) return 'client'
		return null
	}
	const type = getType()
	const isAuthenticated: IsAuthenticated = {
		authenticated: !!(isUser || isClient),
		type: type,
	}

	async function prefetch(): Promise<void> {
		await queryclient.prefetchQuery(queries.authenticate_user(token))
		await queryclient.prefetchQuery(queries.authenticate_client(token))
	}

	const signIn = useCallback(
		(data: ArgsSignIn) => {
			sign_in.mutate(data, {
				onSuccess(data) {
					if (data) {
						setToken(data)
					}
				},
			})
		},
		[token],
	)

	return (
		<authContext.Provider
			value={{
				user,
				client,
				isAuthenticated,
				logOut,
				signUp,
				prefetch,
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
