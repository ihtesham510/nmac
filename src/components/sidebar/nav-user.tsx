import {
	BellIcon,
	CreditCardIcon,
	LogOutIcon,
	MoreVerticalIcon,
	UserCircleIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar'
import { Progress } from '../ui/progress'

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
	const { isMobile } = useSidebar()
	const getCreditColor = (percent: number) => {
		if (percent >= 90) return 'text-red-500 ring-red-500'
		if (percent >= 70) return 'text-amber-500 ring-amber-500'
		return 'text-emerald-500 ring-emerald-500'
	}
	const total = credits?.total ?? 100
	const remaining = credits?.remaining ?? 100
	const percentUsed = ((total - remaining) / total) * 100
	const creditColor = getCreditColor(percentUsed)

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size='lg'
							className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
						>
							<Avatar className='h-8 w-8 rounded-lg grayscale'>
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
							</Avatar>
							<div className='grid flex-1 text-left text-sm leading-tight'>
								<span className='truncate font-medium'>{user.name}</span>
								<span className='truncate text-xs text-muted-foreground'>
									{user.email}
								</span>
							</div>
							<MoreVerticalIcon className='ml-auto size-4' />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
						side={isMobile ? 'bottom' : 'right'}
						align='end'
						sideOffset={4}
					>
						<DropdownMenuLabel className='p-0 font-normal'>
							<div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
								<Avatar className='h-8 w-8 rounded-lg'>
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
						</DropdownMenuLabel>

						<DropdownMenuSeparator />
						{credits && (
							<>
								<DropdownMenuLabel asChild>
									<div className='px-2 py-2 space-y-2'>
										<div className='flex items-center justify-between'>
											<span className='text-xs font-medium'>Credits</span>
											<span className={`text-xs font-bold ${creditColor}`}>
												{Math.round(remaining)} / {Math.round(total)}
											</span>
										</div>
										<div className='space-y-1'>
											<Progress
												value={percentUsed}
												className='h-1.5'
												indicatorClassName={
													percentUsed >= 90
														? 'bg-red-500'
														: percentUsed >= 70
															? 'bg-amber-500'
															: 'bg-emerald-500'
												}
											/>
											<div className='flex justify-between items-center'>
												<span className='text-[10px] text-muted-foreground'>
													{percentUsed.toFixed(0)}% used
												</span>
												<span className='text-[10px] text-muted-foreground'>
													{remaining} remaining
												</span>
											</div>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
							</>
						)}

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<UserCircleIcon />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCardIcon />
								Billing
							</DropdownMenuItem>
							<DropdownMenuItem>
								<BellIcon />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								if (props.onLogOut) {
									props.onLogOut()
								}
							}}
						>
							<LogOutIcon />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	)
}
