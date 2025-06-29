import { type PropsWithChildren } from 'react'
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Calendar, CreditCard, Users, Clock } from 'lucide-react'
import type { Clients } from '@/lib/types'
import { Progress } from '../ui/progress'
import { getSubscriptionBadgeClasses } from '@/lib/utils'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'

interface Props extends PropsWithChildren {
	subscription: Required<Clients[0]['subscription']>
	align?: 'start' | 'center' | 'end'
	side?: 'top' | 'right' | 'bottom' | 'left'
}

export const SubscriptionHoverCard = ({
	subscription,
	children,
	align = 'center',
	side = 'top',
}: Props) => {
	if (!subscription) return null
	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		})
	}

	const usagePercentage = Math.round(
		((subscription.total_credits - subscription.remaining_credits) /
			subscription.total_credits) *
			100,
	)

	const formatCredits = (credits: number) => {
		return credits.toLocaleString()
	}
	return (
		<HoverCard openDelay={0.4}>
			<HoverCardTrigger asChild>{children}</HoverCardTrigger>
			<HoverCardContent
				className='w-80 p-4 m-2'
				align={align}
				side={side}
				sideOffset={5}
			>
				<div className='space-y-4'>
					{/* Header */}
					<div className='flex items-center justify-between'>
						<h4 className='text-md font-semibold text-primary'>
							Subscription Details
						</h4>
						<Badge
							className={`text-xs w-fit capitalize ${getSubscriptionBadgeClasses(subscription.type)}`}
						>
							{subscription.type}
						</Badge>
					</div>

					<Separator />

					{/* Credits Usage */}
					<div className='space-y-6 w-full text-primary'>
						<div className='space-y-2'>
							<div className='flex justify-between items-between'>
								<div className='flex items-center text-primary/75 gap-2'>
									<CreditCard className='size-4 font-semibold' />
									<span className='text-sm font-semibold'>Credits usage</span>
								</div>
								<Badge className='text-xs'>{usagePercentage}%</Badge>
							</div>
							<div className='space-y-2'>
								<div className='flex justify-between text-sm'>
									<span className='text-primary/75'>Remaining</span>
									<span className='font-medium'>
										{formatCredits(subscription.remaining_credits)}
									</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-primary/75'>Total</span>
									<span className='font-medium'>
										{formatCredits(subscription.total_credits)}
									</span>
								</div>
							</div>
						</div>

						<Progress max={100} value={100 - usagePercentage} />

						{/* Subscription Info */}

						<div className='space-y-2'>
							<div className='flex items-center gap-2'>
								<Clock className='h-4 w-4 text-primary/75' />
								<div className='flex-1'>
									<div className='text-sm text-primary/75'>
										Billing Interval
									</div>
									<div className='text-sm font-medium'>
										{subscription.interval}{' '}
										{subscription.interval === 1 ? 'month' : 'months'}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Calendar className='h-4 w-4 text-primary/75' />
								<div className='flex-1'>
									<div className='text-sm text-primary/80'>Subscribed</div>
									<div className='text-sm font-medium'>
										{formatDate(subscription.subscribedAt)}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Users className='h-4 w-4 text-primary/75' />
								<div className='flex-1'>
									<div className='text-sm text-primary/75'>Last Updated</div>
									<div className='text-sm font-medium'>
										{formatDate(subscription.updatedAt)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</HoverCardContent>
		</HoverCard>
	)
}
