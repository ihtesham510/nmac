import { AppSidebar } from '@/components/sidebar'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
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
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className='relative'>
				<header className=' mx-10 flex justify-between items-center h-16 sticky top-0 z-10 bg-background'>
					<SidebarTrigger />
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
