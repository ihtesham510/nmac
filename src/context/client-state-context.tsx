import {
	createContext,
	useContext,
	useState,
	type PropsWithChildren,
} from 'react'

interface ClientContext {
	createClientDialog: { open: boolean; setState: (value: boolean) => void }
}

export const clientStateContext = createContext<ClientContext | null>(null)

export function ClientContextProvider({ children }: PropsWithChildren) {
	const [createClientDialog, setCreateClientDialog] = useState(false)

	return (
		<clientStateContext.Provider
			value={{
				createClientDialog: {
					open: createClientDialog,
					setState: setCreateClientDialog,
				},
			}}
		>
			{children}
		</clientStateContext.Provider>
	)
}

export function useClientState() {
	const ctx = useContext(clientStateContext)
	if (!ctx) throw new Error('client state context provider is not provided')
	return ctx
}
