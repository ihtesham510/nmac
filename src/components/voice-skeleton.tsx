import { Skeleton } from '@/components/ui/skeleton'

export function VoiceFormSkeleton() {
	return (
		<div className='my-5 mb-60 space-y-4'>
			{/* Voice Selection Section */}
			<div className='grid gap-4 p-4 rounded-lg bg-card border border-border'>
				<div className='flex justify-between items-start'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-4 w-80' />
						<Skeleton className='h-4 w-64' />
					</div>
					<div className='flex flex-col gap-3 min-w-[200px]'>
						<Skeleton className='h-10 w-full' />
						<div className='flex gap-2'>
							<Skeleton className='h-8 w-16' />
							<Skeleton className='h-8 w-16' />
						</div>
					</div>
				</div>
			</div>

			{/* Similarity Slider Section */}
			<div className='grid gap-4 p-4 rounded-lg bg-card border border-border'>
				<div className='flex justify-between items-center'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-4 w-96' />
						<Skeleton className='h-4 w-80' />
					</div>
					<div className='flex flex-col items-end gap-2'>
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-2 w-48' />
					</div>
				</div>
			</div>

			{/* Speed Slider Section */}
			<div className='grid gap-4 p-4 rounded-lg bg-card border border-border'>
				<div className='flex justify-between items-center'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-16' />
						<Skeleton className='h-4 w-full max-w-lg' />
						<Skeleton className='h-4 w-72' />
					</div>
					<div className='flex flex-col items-end gap-2'>
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-2 w-48' />
					</div>
				</div>
			</div>

			{/* Stability Slider Section */}
			<div className='grid gap-4 p-4 rounded-lg bg-card border border-border'>
				<div className='flex justify-between items-center'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-20' />
						<Skeleton className='h-4 w-full max-w-md' />
						<Skeleton className='h-4 w-80' />
					</div>
					<div className='flex flex-col items-end gap-2'>
						<Skeleton className='h-4 w-8' />
						<Skeleton className='h-2 w-48' />
					</div>
				</div>
			</div>

			{/* Audio Format Selection Section */}
			<div className='grid gap-4 p-4 rounded-lg bg-card border border-border'>
				<div className='flex justify-between items-start'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-32' />
						<Skeleton className='h-4 w-64' />
					</div>
					<Skeleton className='h-10 w-48' />
				</div>
			</div>
		</div>
	)
}
