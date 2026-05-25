import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from '@/components/sidebar'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/hoc/protected-route'

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
				<header className='sticky top-0 z-11 mx-10 flex h-16 items-center justify-between bg-background'>
					<SidebarTrigger className='size-4' />
				</header>
				<Outlet />
			</SidebarInset>
		</SidebarProvider>
	)
}
