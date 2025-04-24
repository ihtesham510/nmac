import { queries } from '@/api/query-options'
import { LoaderComponent } from '@/components/loader'
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
	component: RouteComponent,
	async beforeLoad(ctx) {
		await ctx.context.auth.prefetch()
	},
	pendingComponent: LoaderComponent,
})

function RouteComponent() {
	const auth = useAuth()
	return (
		<ProtectedRoute>
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
		</ProtectedRoute>
	)
}
