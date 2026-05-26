import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { BotIcon, Check, Clock, User, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { AudioPlayer } from '@/components/audio-wave-visuliser'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'

export const Route = createFileRoute('/dashboard/history/$conversation')({
	component: RouteComponent,
})

const badgeVariants = {
	success:
		'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
	destructive:
		'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
}

function ConversationSkeleton() {
	return (
		<div className='flex h-full gap-6'>
			{/* Left Side Skeleton */}
			<div className='flex min-w-0 flex-1 flex-col'>
				<div className='flex-shrink-0 pb-4'>
					<Skeleton className='mb-4 h-6 w-48' />
					<Skeleton className='mb-4 h-[70px] w-full' />
					<Separator />
				</div>
				<div className='flex min-h-0 flex-1 flex-col pt-4'>
					<Skeleton className='mb-4 h-5 w-24' />
					<div className='space-y-4'>
						{/* Bot message */}
						<div className='flex items-start gap-3'>
							<Skeleton className='size-8 shrink-0 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-10 w-64 rounded-lg' />
								<Skeleton className='h-3 w-10' />
							</div>
						</div>
						{/* User message */}
						<div className='flex flex-row-reverse items-start gap-3'>
							<Skeleton className='size-8 shrink-0 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-10 w-48 rounded-lg' />
								<Skeleton className='ml-auto h-3 w-10' />
							</div>
						</div>
						{/* Bot message */}
						<div className='flex items-start gap-3'>
							<Skeleton className='size-8 shrink-0 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-16 w-72 rounded-lg' />
								<Skeleton className='h-3 w-10' />
							</div>
						</div>
						{/* User message */}
						<div className='flex flex-row-reverse items-start gap-3'>
							<Skeleton className='size-8 shrink-0 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-10 w-56 rounded-lg' />
								<Skeleton className='ml-auto h-3 w-10' />
							</div>
						</div>
						{/* Bot message */}
						<div className='flex items-start gap-3'>
							<Skeleton className='size-8 shrink-0 rounded-full' />
							<div className='space-y-1'>
								<Skeleton className='h-10 w-60 rounded-lg' />
								<Skeleton className='h-3 w-10' />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Side Skeleton */}
			<div className='flex w-80 flex-shrink-0 flex-col border-l pl-6'>
				<div className='flex-shrink-0 pb-4'>
					<Skeleton className='mb-4 h-5 w-32' />
					<Separator />
				</div>
				<div className='flex-1 pt-4'>
					<div className='space-y-4'>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-4 w-16' />
							<Skeleton className='h-5 w-20 rounded-full' />
						</div>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-4 w-20' />
							<Skeleton className='h-4 w-12' />
						</div>
						<div className='flex items-center justify-between'>
							<Skeleton className='h-4 w-24' />
							<Skeleton className='h-4 w-16' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

function RouteComponent() {
	const [open, setOpen] = useState(true)
	const { conversation: conversationId } = Route.useParams()
	const router = useRouter()

	const auth = useAuth()
	const client = useElevenLabsClient()

	const conversation = useQuery(
		queries.get_conversation(client, {
			conversationId,
			enabled: true,
		}),
	)

	const audioBuf = useQuery(
		queries.get_conversation_audio(auth.api_key!, conversationId),
	)

	const successBadge = getSuccessBadge(
		conversation.data?.analysis?.callSuccessful,
	)
	const isPhoneCall = !!conversation.data?.metadata.phoneCall

	return (
		<Sheet
			open={open}
			onOpenChange={e => {
				setOpen(e)
				if (!e) {
					router.navigate({ to: '/dashboard/history' })
				}
			}}
		>
			<SheetContent className='w-full max-w-[1000px] p-6 lg:max-w-[1000px]'>
				{conversation.isLoading && <ConversationSkeleton />}

				{conversation.data && (
					<div className='flex h-full gap-6'>
						{/* Left Side - Audio Player and Transcript */}
						<div className='flex min-w-0 flex-1 flex-col'>
							<div className='flex-shrink-0 pb-4'>
								<SheetTitle className='mb-4'>Conversation Details</SheetTitle>
								{!audioBuf.isLoading && audioBuf.data && (
									<div className='mb-4'>
										<AudioPlayer audioBlob={audioBuf.data} open={open} />
									</div>
								)}
								{audioBuf.isLoading && (
									<Skeleton className='mb-4 h-[70px] w-full rounded-md' />
								)}
								<Separator />
							</div>

							<div className='flex min-h-0 flex-1 flex-col pt-4'>
								<h3 className='mb-4 flex-shrink-0 font-semibold'>Transcript</h3>
								<ScrollArea className='h-[48vh] pr-4 pb-4'>
									<div className='mb-6 space-y-4 pb-4'>
										{conversation.data.transcript.length > 0 ? (
											conversation.data.transcript.map((message, index) => (
												<div
													key={index}
													className={`flex ${
														message.role === 'user'
															? 'justify-end'
															: 'justify-start'
													} items-start gap-3`}
												>
													{message.role !== 'user' && (
														<Avatar className='flex size-8 flex-shrink-0 items-center justify-center bg-muted'>
															<BotIcon className='size-4' />
														</Avatar>
													)}
													<div
														className={`flex max-w-[85%] flex-col space-y-1 ${
															message.role === 'user'
																? 'items-end'
																: 'items-start'
														}`}
													>
														<div
															className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
																message.role === 'user'
																	? 'bg-primary text-primary-foreground'
																	: 'bg-muted'
															}`}
														>
															{typeof message.message === 'undefined' ||
															message.message === ''
																? '...'
																: (message.message ?? '...')}
														</div>
														<div className='flex items-center gap-2 text-muted-foreground text-xs'>
															<span>
																{formatDuration(message.timeInCallSecs)}
															</span>
														</div>
													</div>
													{message.role === 'user' && (
														<Avatar className='flex size-8 flex-shrink-0 items-center justify-center bg-primary-foreground'>
															<User className='size-4' />
														</Avatar>
													)}
												</div>
											))
										) : (
											<div className='py-8 text-center text-muted-foreground'>
												No transcript available
											</div>
										)}
									</div>
								</ScrollArea>
							</div>
						</div>

						{/* Right Side - Metadata */}
						<div className='flex w-80 flex-shrink-0 flex-col border-l pl-6'>
							<div className='flex-shrink-0 pb-4'>
								<h3 className='mb-4 font-semibold'>Call Information</h3>
								<Separator />
							</div>

							<div className='flex-1 pt-4'>
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<span className='font-medium text-sm'>Status:</span>
										<Badge
											variant={
												successBadge.variant === 'success' ||
												successBadge.variant === 'destructive'
													? 'outline'
													: successBadge.variant
											}
											className={`flex w-fit items-center ${
												successBadge.variant === 'success'
													? badgeVariants.success
													: successBadge.variant === 'destructive'
														? badgeVariants.destructive
														: ''
											}`}
										>
											{successBadge.icon}
											{conversation.data?.analysis &&
												conversation.data.analysis.callSuccessful
													.charAt(0)
													.toUpperCase() +
													conversation.data.analysis.callSuccessful.slice(1)}
										</Badge>
									</div>

									<div className='flex items-center justify-between'>
										<span className='font-medium text-sm'>Call Cost:</span>
										<span className='font-mono text-sm'>
											{totalCost(conversation.data.metadata.cost ?? 0, 20)}
										</span>
									</div>

									<div className='flex items-center justify-between'>
										<span className='font-medium text-sm'>Call Duration:</span>
										<span className='font-mono text-sm'>
											{conversation.data.metadata.callDurationSecs} sec
										</span>
									</div>

									{isPhoneCall && (
										<>
											<Separator className='my-4' />
											<h4 className='mb-4 font-semibold'>Phone Info</h4>

											<div className='space-y-3'>
												<div className='flex items-center justify-between'>
													<span className='font-medium text-sm'>
														External No:
													</span>
													<button
														type='button'
														className='max-w-[150px] cursor-pointer truncate text-right font-mono text-sm hover:underline'
														onClick={async () => {
															await navigator.clipboard.writeText(
																conversation.data.metadata.phoneCall
																	?.externalNumber as string,
															)
															toast.success('Phone Number Copied')
														}}
														title={
															conversation.data.metadata.phoneCall
																?.externalNumber
														}
													>
														{
															conversation.data.metadata.phoneCall
																?.externalNumber
														}
													</button>
												</div>

												<div className='flex items-center justify-between'>
													<span className='font-medium text-sm'>Agent No:</span>
													<button
														type='button'
														className='max-w-[150px] cursor-pointer truncate text-right font-mono text-sm hover:underline'
														onClick={async () => {
															await navigator.clipboard.writeText(
																conversation.data.metadata.phoneCall
																	?.agentNumber as string,
															)
															toast.success('Phone Number Copied')
														}}
														title={
															conversation.data.metadata.phoneCall?.agentNumber
														}
													>
														{conversation.data.metadata.phoneCall?.agentNumber}
													</button>
												</div>

												<div className='flex items-center justify-between'>
													<span className='font-medium text-sm'>
														Direction:
													</span>
													<Badge variant='secondary'>
														{conversation.data.metadata.phoneCall?.direction}
													</Badge>
												</div>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				)}
			</SheetContent>
		</Sheet>
	)
}

function getSuccessBadge(success?: string) {
	switch (success) {
		case 'success':
			return {
				variant: 'success' as const,
				icon: <Check className='mr-1 h-3 w-3' />,
			}
		case 'failure':
			return {
				variant: 'destructive' as const,
				icon: <X className='mr-1 h-3 w-3' />,
			}
		case 'pending':
			return {
				variant: 'outline' as const,
				icon: <Clock className='mr-1 h-3 w-3' />,
			}
		default:
			return { variant: 'outline' as const, icon: null }
	}
}

function formatDuration(seconds: number): string {
	if (seconds === 0) return '00:00'
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function totalCost(cost: number, percentage: number) {
	return Math.round(cost + cost * (percentage / 100))
}
