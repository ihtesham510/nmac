import { BotIcon, History, SettingsIcon, Users2Icon } from 'lucide-react'
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
			hidden: false,
		},
		{
			title: 'Agents',
			href: { to: '/dashboard/agents' },
			icon: BotIcon,
			isActive: !!route({ to: '/dashboard/agents', fuzzy: true }),
			hidden: auth.type === 'client',
		},
		{
			title: 'History',
			href: { to: '/dashboard/history' },
			icon: History,
			isActive: !!route({ to: '/dashboard/history', fuzzy: true }),
			hidden: auth.type === 'user',
		},
		{
			title: 'Clients',
			href: { to: '/dashboard/clients' },
			isActive: !!route({ to: '/dashboard/clients', fuzzy: true }),
			hidden: auth.type === 'client',
			icon: Users2Icon,
		},
		{
			title: 'Settings',
			href: { to: '/dashboard/settings' },
			icon: SettingsIcon,
			isActive: !!route({ to: '/dashboard/settings', fuzzy: true }),
			hidden: auth.type === 'client',
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
						avatar: auth.user?.image?.url,
					}}
				/>
			</SidebarFooter>
		</Sidebar>
	)
}
