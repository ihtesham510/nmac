import { LogOutIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

export interface NavUserProps {
	user: {
		name: string
		email: string
		avatar?: string
	}
	credits?: {
		total: number
		remaining: number
	}
	onLogOut?: () => void
}

export function NavUser({ user, credits, ...props }: NavUserProps) {
	const total = credits?.total ?? 100
	const remaining = credits?.remaining ?? 100
	const percentUsed = ((total - remaining) / total) * 100

	return (
		<SidebarMenu className='bg-card border-border border p-2 space-y-1 rounded-lg'>
			<SidebarMenuItem>
				<div className='flex gap-2 items-center'>
					<Avatar className='h-10 w-10 rounded-lg grayscale'>
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
					</Avatar>
					<div className='grid flex-1 text-left text-sm leading-tight'>
						<span className='truncate font-medium'>{user.name}</span>
						<span className='truncate text-xs text-muted-foreground'>
							{user.email}
						</span>
					</div>
				</div>
			</SidebarMenuItem>
			{credits && (
				<SidebarMenuItem className='flex flex-col space-y-2 my-1 mx-1'>
					<span className='font-medium flex justify-between items-center text-sm'>
						<p>Total :</p>
						<p> {credits?.total}</p>
					</span>
					<span className='font-medium flex justify-between items-center text-sm'>
						<p>Remaining :</p>
						<p> {Math.round(credits.remaining)}</p>
					</span>
					<Progress
						value={100 - percentUsed}
						max={100}
						destructive={100 - percentUsed < 20}
						className='w-auto h-1.5'
					/>
				</SidebarMenuItem>
			)}
			<Separator className='my-1 mb-2' />
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={props.onLogOut}
					className='bg-primary rounded-sm text-primary-foreground flex justify-center items-center gap-2'
				>
					<p>Sign Out</p> <LogOutIcon className='size-4' />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
