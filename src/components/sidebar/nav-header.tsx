import { Link } from '@tanstack/react-router'
import { PhoneIcon } from 'lucide-react'
import {
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
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
						<Link to='/dashboard'>
							<PhoneIcon className='h-5 w-5' />
							<span className='font-semibold text-base'>
								Never Miss A Call.
							</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarHeader>
	)
}
