import type { ConversationSummaryResponseModel } from '@elevenlabs/elevenlabs-js/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { format, fromUnixTime } from 'date-fns'
import {
	ArrowUpDown,
	BotIcon,
	Calendar,
	Check,
	Clock,
	Filter,
	MessageSquare,
	Search,
	User,
	X,
} from 'lucide-react'
import { type PropsWithChildren, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { AudioPlayer } from '@/components/audio-wave-visuliser'
import { LoaderComponent } from '@/components/loader'
import { Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/context/auth-context'
import { useAgents } from '@/hooks/use-agents'

const badgeVariants = {
	success:
		'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400',
	destructive:
		'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400',
}

export const Route = createFileRoute('/dashboard/history')({
	component: RouteComponent,
})

function RouteComponent() {
	const agents = useAgents()
	const client = useElevenLabsClient()
	const conversations = useQuery(
		queries.list_conversations(client, {
			filter: agents.map(agent => agent.agentId),
		}),
	)

	return (
		<>
			{conversations.isLoading && <LoaderComponent />}
			{conversations.data && (
				<Conversations calls={conversations.data.conversations} />
			)}
		</>
	)
}

function Conversations({
	calls,
}: {
	calls: ConversationSummaryResponseModel[]
}) {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState<string>('all')
	const [successFilter, setSuccessFilter] = useState<string>('all')
	const [sortConfig, setSortConfig] = useState<{
		key: keyof ConversationSummaryResponseModel
		direction: 'asc' | 'desc'
	}>({
		key: 'startTimeUnixSecs',
		direction: 'desc',
	})

	const filteredCalls = calls.filter(call => {
		const matchesSearch =
			call.agentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			call.conversationId.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesStatus = statusFilter === 'all' || call.status === statusFilter
		const matchesSuccess =
			successFilter === 'all' || call.callSuccessful === successFilter

		return matchesSearch && matchesStatus && matchesSuccess
	})

	const sortedCalls = [...filteredCalls].sort((a, b) => {
		const aValue = a[sortConfig.key]
		const bValue = b[sortConfig.key]

		if (aValue === undefined || bValue === undefined) {
			if (aValue === undefined && bValue === undefined) return 0
			return aValue === undefined ? 1 : -1
		}

		if (aValue < bValue) {
			return sortConfig.direction === 'asc' ? -1 : 1
		}
		if (aValue > bValue) {
			return sortConfig.direction === 'asc' ? 1 : -1
		}
		return 0
	})

	const handleSort = (key: keyof ConversationSummaryResponseModel) => {
		setSortConfig({
			key,
			direction:
				sortConfig.key === key && sortConfig.direction === 'asc'
					? 'desc'
					: 'asc',
		})
	}

	return (
		<div className='m-10'>
			<div className='grid gap-6'>
				<div className='grid gap-2'>
					<h1 className='font-bold text-4xl'>Call History</h1>
					<h2 className='text-primary/50'>
						View and manage your agent call history
					</h2>
				</div>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col gap-4 sm:flex-row'>
						<div className='relative flex-1'>
							<Search className='absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								placeholder='Search by agent or conversation ID...'
								className='pl-8'
								value={searchTerm}
								onChange={e => setSearchTerm(e.target.value)}
							/>
						</div>
						<div className='flex gap-2'>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className='w-[160px]'>
									<Filter className='mr-2 h-4 w-4' />
									<SelectValue placeholder='Status' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Statuses</SelectItem>
									<SelectItem value='in-progress'>In Progress</SelectItem>
									<SelectItem value='done'>Done</SelectItem>
									<SelectItem value='failed'>Failed</SelectItem>
									<SelectItem value='pending'>Pending</SelectItem>
								</SelectContent>
							</Select>

							<Select value={successFilter} onValueChange={setSuccessFilter}>
								<SelectTrigger className='w-[160px]'>
									<Check className='mr-2 h-4 w-4' />
									<SelectValue
										placeholder='Result'
										className='hidden md:block'
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='all'>All Results</SelectItem>
									<SelectItem value='success'>Success</SelectItem>
									<SelectItem value='failure'>Failure</SelectItem>
									<SelectItem value='unknown'>Unknown</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className='rounded-md border'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className='w-[200px]'>
										<Button
											variant='ghost'
											onClick={() => handleSort('agentName')}
											className='flex h-auto items-center justify-start gap-2 font-medium'
										>
											<User className='h-4 w-4' />
											Agent
											{sortConfig.key === 'agentName' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='hidden w-[180px] md:table-cell'>
										<Button
											variant='ghost'
											onClick={() => handleSort('startTimeUnixSecs')}
											className='flex h-auto items-center justify-start gap-2 font-medium'
										>
											<Calendar className='h-4 w-4' />
											Start Time
											{sortConfig.key === 'startTimeUnixSecs' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='hidden w-[120px] text-center sm:table-cell'>
										<Button
											variant='ghost'
											onClick={() => handleSort('callDurationSecs')}
											className='flex h-auto w-full items-center justify-center gap-2 font-medium'
										>
											<Clock className='h-4 w-4' />
											Duration
											{sortConfig.key === 'callDurationSecs' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='hidden w-[120px] text-center sm:table-cell'>
										<Button
											variant='ghost'
											onClick={() => handleSort('messageCount')}
											className='flex h-auto w-full items-center justify-center gap-2 font-medium'
										>
											<MessageSquare className='h-4 w-4' />
											Messages
											{sortConfig.key === 'messageCount' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='hidden w-[120px] sm:table-cell'>
										Status
									</TableHead>
									<TableHead className='w-[120px]'>Result</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedCalls.length > 0 ? (
									sortedCalls.map(call => {
										const statusBadge = getStatusBadge(call.status)
										const successBadge = getSuccessBadge(call.callSuccessful)

										return (
											<ConversationSideSheet
												key={call.agentId}
												conversationId={call.conversationId}
											>
												<TableRow
													key={call.conversationId}
													className='cursor-pointer'
												>
													<TableCell className='font-medium'>
														{call.agentName || 'Unknown Agent'}
													</TableCell>
													<TableCell className='hidden md:table-cell'>
														{format(
															fromUnixTime(call.startTimeUnixSecs),
															'MMM d, yyyy h:mm a',
														)}
													</TableCell>
													<TableCell className='hidden text-center sm:table-cell'>
														{formatDuration(call.callDurationSecs)}
													</TableCell>
													<TableCell className='hidden text-center sm:table-cell'>
														{call.messageCount}
													</TableCell>
													<TableCell className='hidden sm:table-cell'>
														<Badge
															variant={statusBadge.variant}
															className='flex w-fit items-center'
														>
															{statusBadge.icon}
															{call.status.charAt(0).toUpperCase() +
																call.status.slice(1)}
														</Badge>
													</TableCell>
													<TableCell>
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
															{call.callSuccessful.charAt(0).toUpperCase() +
																call.callSuccessful.slice(1)}
														</Badge>
													</TableCell>
												</TableRow>
											</ConversationSideSheet>
										)
									})
								) : (
									<TableRow>
										<TableCell colSpan={6} className='h-24 text-center'>
											No calls found.
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	)
}

function ConversationSideSheet({
	conversationId,
	children,
}: { conversationId: string } & PropsWithChildren) {
	const [open, setIsOpen] = useState(false)
	const client = useElevenLabsClient()
	const conversation = useQuery(
		queries.get_conversation(client, {
			conversationId,
			enabled: !!(conversationId && open),
		}),
	)
	const auth = useAuth()
	const audioBuf = useQuery(
		queries.get_conversation_audio(auth.api_key!, conversationId),
	)
	const queryClient = useQueryClient()
	useEffect(() => {
		if (open) {
			queryClient.invalidateQueries({
				queryKey: [conversationId],
			})
		}
	}, [conversationId, open, queryClient.invalidateQueries])

	const successBadge = getSuccessBadge(
		conversation.data?.analysis?.callSuccessful,
	)
	const isPhoneCall = !!conversation.data?.metadata.phoneCall

	return (
		<Sheet open={open} onOpenChange={e => setIsOpen(e)}>
			<SheetTrigger asChild>{children}</SheetTrigger>
			{conversation.data && (
				<SheetContent className='w-full max-w-[1000px] p-6 lg:max-w-[1000px]'>
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
								<Separator />
							</div>

							<div className='flex min-h-0 flex-1 flex-col pt-4'>
								<h3 className='mb-4 flex-shrink-0 font-semibold'>Transcript</h3>
								<ScrollArea className='h-[48vh] pr-4 pb-4'>
									<div className='mb-6 space-y-4 pb-4'>
										{conversation.data.transcript.length > 0 ? (
											conversation.data?.transcript.map((message, index) => (
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
												conversation.data?.analysis?.callSuccessful
													.charAt(0)
													.toUpperCase() +
													conversation.data?.analysis?.callSuccessful.slice(1)}
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
				</SheetContent>
			)}
		</Sheet>
	)
}

function totalCost(cost: number, percentage: number) {
	return Math.round(cost + cost * (percentage / 100))
}

function formatDuration(seconds: number): string {
	if (seconds === 0) return '00:00'
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getStatusBadge(status?: string) {
	switch (status) {
		case 'in-progress':
			return {
				variant: 'outline' as const,
				icon: <Clock className='mr-1 h-3 w-3' />,
			}
		case 'done':
			return {
				variant: 'secondary' as const,
				icon: <Check className='mr-1 h-3 w-3' />,
			}
		default:
			return { variant: 'outline' as const, icon: null }
	}
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
