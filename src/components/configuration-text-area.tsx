import * as React from 'react'
import { InfoIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

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
			className={cn('rounded-lg bg-card border-border border p-4', className)}
		>
			<div className='mb-2 flex items-center gap-1.5'>
				<h3 className='text-base font-medium text-white'>{title}</h3>
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
