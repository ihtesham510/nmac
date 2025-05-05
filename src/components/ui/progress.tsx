import * as React from 'react'

import { cn } from '@/lib/utils'

const Progress = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		value?: number
		max?: number
		indicatorClassName?: string
	}
>(({ className, value, max = 100, indicatorClassName, ...props }, ref) => {
	const percentage = value != null ? Math.min(Math.max(value, 0), max) : 0

	return (
		<div
			ref={ref}
			role='progressbar'
			aria-valuemin={0}
			aria-valuemax={max}
			aria-valuenow={percentage}
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
				className,
			)}
			{...props}
		>
			<div
				className={cn(
					'h-full w-full flex-1 bg-primary transition-all',
					indicatorClassName,
				)}
				style={{ transform: `translateX(-${100 - percentage}%)` }}
			/>
		</div>
	)
})
Progress.displayName = 'Progress'

export { Progress }
