import { BotIcon, Users2Icon } from 'lucide-react'
import { Sidebar, SidebarContent, SidebarFooter } from '../ui/sidebar'
import { NavHeader } from './nav-header'
import { useMatchRoute } from '@tanstack/react-router'
import { useAuth } from '@/context/auth-context'
import { type NavMainProps, NavMain } from './nav-main'
import { NavUser } from './nav-user'

export function AppSidebar() {
	const route = useMatchRoute()
	const auth = useAuth()
	const items: NavMainProps['items'] = [
		{
			title: 'Analytics',
			href: { to: '/dashboard/analytics' },
			icon: BotIcon,
			isActive: !!route({ to: '/dashboard/analytics', fuzzy: true }),
			hidden: auth.isAuthenticated.type === 'client',
		},
		{
			title: 'Agents',
			href: { to: '/dashboard/agents' },
			icon: BotIcon,
			isActive: !!route({ to: '/dashboard/agents', fuzzy: true }),
			hidden: auth.isAuthenticated.type === 'client',
		},
		{
			title: 'Clients',
			href: { to: '/dashboard/clients' },
			isActive: !!route({ to: '/dashboard/clients', fuzzy: true }),
			hidden: auth.isAuthenticated.type === 'client',
			icon: Users2Icon,
		},
	]
	return (
		<Sidebar collapsible='offcanvas'>
			<NavHeader />
			<SidebarContent>
				<NavMain items={items} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser
					user={{
						email: 'ihteshamulhaq510@gmail.com',
						name: 'ihtesham',
						avatar: '',
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
