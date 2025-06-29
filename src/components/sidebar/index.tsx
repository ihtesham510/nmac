import {
	BotIcon,
	ChartLine,
	History,
	PhoneIcon,
	Settings,
	SettingsIcon,
	Users2Icon,
} from 'lucide-react'
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
			icon: ChartLine,
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
			hidden: false,
		},

		{
			title: 'Phone Numbers',
			href: { to: '/dashboard/phone' },
			icon: PhoneIcon,
			isActive: !!route({ to: '/dashboard/phone', fuzzy: true }),
			hidden: false,
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
		{
			title: 'Project Settings',
			href: { to: '/dashboard/project-settings/agent' },
			icon: Settings,
			isActive: !!route({ to: '/dashboard/project-settings', fuzzy: true }),
			hidden: auth.type === 'user',
		},
	]
	return (
		<Sidebar collapsible='offcanvas'>
			<NavHeader />
			<SidebarContent>
				<NavMain items={items} />
			</SidebarContent>
			<SidebarFooter>
				{auth.isAuthenticated && auth.type === 'user' && (
					<NavUser
						user={{
							email: auth.user!.email,
							name: `${auth.user!.first_name} ${auth.user!.last_name}`,
							avatar: auth.user?.image?.url,
						}}
						onLogOut={() => auth.logOut()}
					/>
				)}
				{auth.isAuthenticated && auth.type === 'client' && (
					<NavUser
						user={{
							email: auth.client?.username!,
							name: `${auth.client!.name}`,
							avatar: auth.user?.image?.url,
						}}
						credits={{
							remaining: auth.client!.subscription!.remaining_credits,
							total: auth.client!.subscription!.total_credits,
						}}
						onLogOut={() => auth.logOut()}
					/>
				)}
			</SidebarFooter>
		</Sidebar>
	)
}
