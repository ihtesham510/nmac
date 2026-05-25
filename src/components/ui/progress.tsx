import * as ProgressPrimitive from '@radix-ui/react-progress'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Progress({
	className,
	value,
	destructive,
	...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
	destructive?: boolean
}) {
	return (
		<ProgressPrimitive.Root
			data-slot='progress'
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot='progress-indicator'
				className={`h-full w-full flex-1 transition-all ${destructive ? 'bg-destructive' : 'bg-primary'}`}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	)
}

export { Progress }
