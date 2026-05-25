import { InfoIcon } from 'lucide-react'
import type * as React from 'react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface ConfigSectionProps {
	title: string
	description: string
	children: React.ReactNode
	infoTooltip?: string
	className?: string
}

export function ConfigSection({
	title,
	description,
	children,
	infoTooltip,
	className,
}: ConfigSectionProps) {
	return (
		<div
			className={cn('rounded-lg border border-border bg-card p-4', className)}
		>
			<div className='mb-2 flex items-center gap-1.5'>
				<h3 className='font-medium text-base text-white'>{title}</h3>
				{infoTooltip && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<InfoIcon className='h-4 w-4 text-zinc-400' />
							</TooltipTrigger>
							<TooltipContent side='top' className='max-w-xs'>
								{infoTooltip}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
			<p className='mb-4 text-sm text-zinc-400'>{description}</p>
			{children}
		</div>
	)
}
