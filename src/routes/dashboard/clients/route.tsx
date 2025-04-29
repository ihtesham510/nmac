import { CreateClientForm } from '@/components/create-client-form'
import { Dialog, DialogHeader } from '@/components/ui/dialog'
import {
	ClientContextProvider,
	useClientState,
} from '@/context/client-state-context'
import {
	DialogContent,
	DialogTitle,
	DialogDescription,
} from '@/components/ui/dialog'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProtectedUserRoute } from '@/hoc/protected-user-route'

export const Route = createFileRoute('/dashboard/clients')({
	component: () => (
		<ProtectedUserRoute>
			<ClientContextProvider>
				<RouteComponent />
			</ClientContextProvider>
		</ProtectedUserRoute>
	),
})

function RouteComponent() {
	const { createClientDialog } = useClientState()
	return (
		<div>
			<Outlet />
			<Dialog
				open={createClientDialog.open}
				onOpenChange={e => createClientDialog.setState(e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Client</DialogTitle>
						<DialogDescription>
							Create a new client and attach you're agent.
						</DialogDescription>
					</DialogHeader>
					<CreateClientForm />
				</DialogContent>
			</Dialog>
		</div>
	)
}
