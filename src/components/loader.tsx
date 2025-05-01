import { cn } from '@/lib/utils'
import { LoaderCircle } from 'lucide-react'

export function LoaderComponent({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				'h-screen w-full flex justify-center items-center',
				className,
			)}
		>
			<LoaderCircle className='size-8 animate-spin' />
		</div>
	)
}
