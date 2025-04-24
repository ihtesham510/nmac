import { ArrowUpCircleIcon } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '../ui/sidebar'

export function NavHeader() {
	return (
		<SidebarHeader>
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton
						asChild
						className='data-[slot=sidebar-menu-button]:!p-1.5'
					>
						<Link to='/'>
							<ArrowUpCircleIcon className='h-5 w-5' />
							<span className='text-base font-semibold'>Acme Inc.</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	)
}
