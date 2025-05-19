import { cn } from '@/lib/utils'
import type { PropsWithChildren } from 'react'

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
				'rounded-lg bg-primary-foreground p-4 flex justify-between items-center',
				props.className,
			)}
		>
			<div className='flex flex-col gap-1'>
				<h1 className='text-lg font-medium text-white'>{props.title}</h1>
				<p className='mb-4 text-sm text-primary/50'>{props.description}</p>
			</div>
			<div className={cn('min-w-[200px] p-[20px]', props.child?.className)}>
				{props.children}
			</div>
		</div>
	)
}
