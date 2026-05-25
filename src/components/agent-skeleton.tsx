import { Skeleton } from '@/components/ui/skeleton'

export function UpdateAgentSettingsFormSkeleton() {
	return (
		<div className='mb-60'>
			<div className='relative mb-6 grid gap-6'>
				{/* First Message Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-32' />
						<Skeleton className='h-4 w-96' />
					</div>
					<Skeleton className='h-[100px] w-full' />
				</div>

				{/* System Prompt Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex flex-col gap-2'>
						<Skeleton className='h-5 w-28' />
						<Skeleton className='h-4 w-80' />
					</div>
					<Skeleton className='h-[300px] w-full' />
				</div>

				{/* LLM Selection Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex items-start justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-5 w-12' />
							<Skeleton className='h-4 w-full max-w-md' />
							<Skeleton className='h-4 w-full max-w-lg' />
						</div>
						<Skeleton className='h-10 w-48' />
					</div>
				</div>

				{/* Temperature Slider Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-5 w-24' />
							<Skeleton className='h-4 w-72' />
						</div>
						<div className='flex flex-col items-end gap-2'>
							<Skeleton className='h-4 w-8' />
							<Skeleton className='h-2 w-48' />
						</div>
					</div>
				</div>

				{/* Knowledge Base Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-6 w-36' />
							<Skeleton className='h-4 w-80' />
							<Skeleton className='h-4 w-64' />
						</div>
						<div className='min-w-[200px] p-[20px]'>
							<Skeleton className='h-10 w-full' />
						</div>
					</div>

					{/* Knowledge Base Items */}
					<div className='grid w-full gap-2 rounded-lg bg-primary-foreground p-2'>
						{[1, 2, 3].map(item => (
							<div key={item} className='flex items-center justify-between p-2'>
								<div className='flex items-center justify-center gap-4'>
									<Skeleton className='h-10 w-10' />
									<Skeleton className='h-4 w-32' />
								</div>
								<Skeleton className='h-10 w-10' />
							</div>
						))}
					</div>

					{/* RAG Toggle Section */}
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-6 w-20' />
							<Skeleton className='h-4 w-96' />
							<Skeleton className='h-4 w-80' />
							<Skeleton className='h-4 w-72' />
						</div>
						<div className='min-w-[80px] p-[20px]'>
							<Skeleton className='h-6 w-12 rounded-full' />
						</div>
					</div>
				</div>

				{/* Tools Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-6 w-16' />
							<Skeleton className='h-4 w-64' />
						</div>
						<div className='min-w-[200px] p-[20px]'>
							<Skeleton className='h-10 w-full' />
						</div>
					</div>

					{/* Tools Items */}
					<div className='grid w-full gap-2 rounded-lg bg-primary-foreground p-2'>
						{[1, 2].map(item => (
							<div key={item} className='flex items-center justify-between p-2'>
								<div className='flex items-center justify-center gap-4'>
									<Skeleton className='h-10 w-10' />
									<div className='flex flex-col gap-2'>
										<Skeleton className='h-4 w-28' />
										<Skeleton className='h-3 w-48' />
									</div>
								</div>
								<Skeleton className='h-10 w-10' />
							</div>
						))}
					</div>
				</div>

				{/* Max Duration Section */}
				<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex flex-col gap-2'>
							<Skeleton className='h-5 w-48' />
							<Skeleton className='h-4 w-72' />
						</div>
						<Skeleton className='h-10 w-24' />
					</div>
				</div>
			</div>
		</div>
	)
}
