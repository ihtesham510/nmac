import NumberFlow from '@number-flow/react'
import { Link } from '@tanstack/react-router'
import { CreditCardIcon, LogOutIcon } from 'lucide-react'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Badge } from '../ui/badge'

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
		<SidebarMenu className='space-y-1 rounded-lg border border-border bg-card p-2'>
			<SidebarMenuItem>
				<div className='flex items-center gap-2'>
					<Avatar className='h-10 w-10 rounded-lg grayscale'>
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
					</Avatar>
					<div className='grid flex-1 text-left text-sm leading-tight'>
						<span className='truncate font-medium text-lg'>{user.name}</span>
						<span className='truncate text-muted-foreground text-xs'>
							{user.email}
						</span>
					</div>
				</div>
			</SidebarMenuItem>
			{credits && (
				<React.Fragment>
					<Separator className='my-1' />
					<SidebarMenuItem className='mx-1 my-1 flex flex-col space-y-2'>
						<div className='flex justify-between'>
							<div className='flex items-center gap-2'>
								<CreditCardIcon className='size-4' />
								<p className='font-medium text-sm'>Credits</p>
							</div>
							<Link to='/pricing'>
								<Badge className='cursor-pointer select-none'>Upgrade</Badge>
							</Link>
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex flex-col gap-2 py-2'>
								<span className='flex items-center justify-between font-medium text-sm'>
									<p>Total :</p>
									<p>
										<NumberFlow value={Math.round(credits.total)} />
									</p>
								</span>
								<span className='flex items-center justify-between font-medium text-sm'>
									<p>Remaining :</p>
									<NumberFlow value={Math.round(credits.remaining)} />
								</span>
							</div>
							<Progress
								value={100 - percentUsed}
								max={100}
								destructive={100 - percentUsed < 20}
								className='h-1.5 w-auto'
							/>
						</div>
					</SidebarMenuItem>
				</React.Fragment>
			)}
			<Separator className='my-1 mb-2' />
			<SidebarMenuItem>
				<SidebarMenuButton
					onClick={props.onLogOut}
					className='flex items-center justify-center gap-2 rounded-sm bg-primary text-primary-foreground'
				>
					<p>Sign Out</p> <LogOutIcon className='size-4' />
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
