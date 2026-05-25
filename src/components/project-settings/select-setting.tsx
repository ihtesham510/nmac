import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export function SelectSetting(
	props: {
		className?: string
		title: string
		description: string
		child?: {
			className: string
		}
	} & PropsWithChildren,
) {
	return (
		<div
			className={cn(
				'flex items-center justify-between rounded-lg border border-border bg-card p-4',
				props.className,
			)}
		>
			<div className='flex flex-col gap-1'>
				<h1 className='font-medium text-lg text-white'>{props.title}</h1>
				<p className='mb-4 text-primary/50 text-sm'>{props.description}</p>
			</div>
			<div className={cn('min-w-[200px] p-[20px]', props.child?.className)}>
				{props.children}
			</div>
		</div>
	)
}
