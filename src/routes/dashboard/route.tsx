import { AppSidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuth } from '@/context/auth-context'
import { ProtectedRoute } from '@/hoc/protected-route'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
	component: () => (
		<ProtectedRoute>
			<RouteComponent />
		</ProtectedRoute>
	),
})

function RouteComponent() {
	const auth = useAuth()
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className=' mx-10 flex justify-between items-center h-20'>
					<SidebarTrigger />
					<Button onClick={auth.logOut}>Sign Out</Button>
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
