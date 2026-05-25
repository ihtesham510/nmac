import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LoaderComponent({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'flex h-screen w-full items-center justify-center',
				className,
			)}
		>
			<LoaderCircle className='size-8 animate-spin' />
		</div>
	)
}
