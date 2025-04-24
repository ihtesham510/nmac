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
	return (
		<ProtectedRoute>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					<Outlet />
				</SidebarInset>
			</SidebarProvider>
		</ProtectedRoute>
	)
}
