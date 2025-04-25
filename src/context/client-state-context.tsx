import {
	createContext,
	useCallback,
	useContext,
	useState,
	type PropsWithChildren,
} from 'react'
import { Alert, type AlertProps } from '@/components/alert-dialog'

interface ClientContext {
	createClientDialog: { open: boolean; setState: (value: boolean) => void }
	alert: (options: Omit<AlertProps, 'onOpenChange'>) => void
}

export const clientStateContext = createContext<ClientContext | null>(null)

export function ClientContextProvider({ children }: PropsWithChildren) {
	const [createClientDialog, setCreateClientDialog] = useState(false)
	const [alertProps, setAlertProps] = useState<AlertProps | null>(null)

	const showAlert = useCallback((options: Omit<AlertProps, 'onOpenChange'>) => {
		setAlertProps({
			...options,
			onOpenChange: (open: boolean) => {
				if (!open) {
					setAlertProps(null)
				}
			},
		})
	}, [])

	return (
		<clientStateContext.Provider
			value={{
				createClientDialog: {
					open: createClientDialog,
					setState: setCreateClientDialog,
				},
				alert: showAlert,
			}}
		>
			{children}
			{alertProps && <Alert {...alertProps} />}
		</clientStateContext.Provider>
	)
}

export function useClientState() {
	const ctx = useContext(clientStateContext)
	if (!ctx) throw new Error('client state context provider is not provided')
	return ctx
}
