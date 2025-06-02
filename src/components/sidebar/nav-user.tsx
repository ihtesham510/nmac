import { CreditCardIcon, LogOutIcon } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import NumberFlow from '@number-flow/react'

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
						<span className='truncate font-medium text-lg'>{user.name}</span>
						<span className='truncate text-xs text-muted-foreground'>
							{user.email}
						</span>
					</div>
				</div>
			</SidebarMenuItem>
			{credits && (
				<React.Fragment>
					<Separator className='my-1' />
					<SidebarMenuItem className='flex flex-col space-y-2 my-1 mx-1'>
						<div className='flex gap-2 items-center'>
							<CreditCardIcon className='size-4' />
							<p className='font-medium text-sm'>Credits</p>
						</div>
						<div className='flex flex-col gap-2'>
							<div className='flex flex-col py-2 gap-2'>
								<span className='font-medium flex justify-between items-center text-sm'>
									<p>Total :</p>
									<p>
										<NumberFlow value={Math.round(credits.total)} />
									</p>
								</span>
								<span className='font-medium flex justify-between items-center text-sm'>
									<p>Remaining :</p>
									<NumberFlow value={Math.round(credits.remaining)} />
								</span>
							</div>
							<Progress
								value={100 - percentUsed}
								max={100}
								destructive={100 - percentUsed < 20}
								className='w-auto h-1.5'
							/>
						</div>
					</SidebarMenuItem>
				</React.Fragment>
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
