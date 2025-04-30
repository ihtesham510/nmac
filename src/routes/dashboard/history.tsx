import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState, type PropsWithChildren } from 'react'
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
import { format, fromUnixTime } from 'date-fns'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import type { ConversationSummaryResponseModel } from 'elevenlabs/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { useAgents } from '@/hooks/use-agents'
import { LoaderComponent } from '@/components/loader'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Avatar } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useElevenLabsClient } from '@/api/client'
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
		key: 'start_time_unix_secs',
		direction: 'desc',
	})

	const filteredCalls = calls.filter(call => {
		const matchesSearch =
			call.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			call.conversation_id.toLowerCase().includes(searchTerm.toLowerCase())

		const matchesStatus = statusFilter === 'all' || call.status === statusFilter
		const matchesSuccess =
			successFilter === 'all' || call.call_successful === successFilter

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
					<h1 className='text-4xl font-bold'>Call History</h1>
					<h2 className='text-primary/50'>
						View and manage your agent call history
					</h2>
				</div>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col sm:flex-row gap-4'>
						<div className='relative flex-1'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
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
									<Filter className='h-4 w-4 mr-2' />
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
									<Check className='h-4 w-4 mr-2' />
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
											onClick={() => handleSort('agent_name')}
											className='flex items-center gap-2 h-auto font-medium justify-start'
										>
											<User className='h-4 w-4' />
											Agent
											{sortConfig.key === 'agent_name' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='w-[180px]'>
										<Button
											variant='ghost'
											onClick={() => handleSort('start_time_unix_secs')}
											className='flex items-center gap-2 h-auto font-medium justify-start'
										>
											<Calendar className='h-4 w-4' />
											Start Time
											{sortConfig.key === 'start_time_unix_secs' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='w-[120px] text-center'>
										<Button
											variant='ghost'
											onClick={() => handleSort('call_duration_secs')}
											className='flex items-center justify-center gap-2 h-auto font-medium w-full'
										>
											<Clock className='h-4 w-4' />
											Duration
											{sortConfig.key === 'call_duration_secs' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='w-[120px] text-center'>
										<Button
											variant='ghost'
											onClick={() => handleSort('message_count')}
											className='flex items-center gap-2  h-auto font-medium w-full justify-center'
										>
											<MessageSquare className='h-4 w-4' />
											Messages
											{sortConfig.key === 'message_count' && (
												<ArrowUpDown className='h-3 w-3' />
											)}
										</Button>
									</TableHead>
									<TableHead className='w-[120px]'>Status</TableHead>
									<TableHead className='w-[120px]'>Result</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{sortedCalls.length > 0 ? (
									sortedCalls.map(call => {
										const statusBadge = getStatusBadge(call.status)
										const successBadge = getSuccessBadge(call.call_successful)

										return (
											<ConversationSideSheet
												conversationId={call.conversation_id}
											>
												<TableRow
													key={call.conversation_id}
													className='cursor-pointer'
												>
													<TableCell className='font-medium'>
														{call.agent_name || 'Unknown Agent'}
													</TableCell>
													<TableCell>
														{format(
															fromUnixTime(call.start_time_unix_secs),
															'MMM d, yyyy h:mm a',
														)}
													</TableCell>
													<TableCell className='text-center'>
														{formatDuration(call.call_duration_secs)}
													</TableCell>
													<TableCell className='text-center'>
														{call.message_count}
													</TableCell>
													<TableCell>
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
															{call.call_successful.charAt(0).toUpperCase() +
																call.call_successful.slice(1)}
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
	const queryClient = useQueryClient()
	useEffect(() => {
		if (open) {
			queryClient.invalidateQueries({
				queryKey: [conversationId],
			})
		}
	}, [conversationId, open])
	return (
		<Sheet open={open} onOpenChange={e => setIsOpen(e)}>
			<SheetTrigger asChild>{children}</SheetTrigger>
			{conversation.data && (
				<SheetContent className='w-full sm:max-w-md md:max-w-xl'>
					<SheetHeader className='space-y-1'>
						<SheetTitle>Conversation Details</SheetTitle>

						<SheetDescription>
							<div className='flex flex-col space-y-1'>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-muted-foreground'>
										{conversation.data.conversation_id}
									</span>
								</div>
								<div className='flex items-center justify-between'>
									<span className='text-sm text-muted-foreground'>
										Started:{' '}
										{format(
											fromUnixTime(
												conversation.data.metadata.start_time_unix_secs,
											),
											'MMM d, yyyy h:mm a',
										)}
									</span>
									<span className='text-sm text-muted-foreground'>
										Duration:{' '}
										{formatDuration(
											conversation.data.metadata.call_duration_secs,
										)}
									</span>
								</div>
							</div>
						</SheetDescription>
					</SheetHeader>

					<Separator className='my-4' />

					<div className='space-y-4 m-4'>
						<h3 className='text-sm font-medium'>Transcript</h3>
						<ScrollArea className='h-[calc(100vh-250px)] pr-4'>
							<div className='space-y-4'>
								{conversation.data.transcript.length > 0 ? (
									conversation.data &&
									conversation.data.transcript.map((message, index) => (
										<div
											key={index}
											className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-2`}
										>
											{message.role !== 'user' && (
												<Avatar className='size-10 flex justify-center items-center bg-muted'>
													<BotIcon className='size-4' />
												</Avatar>
											)}
											<div
												className={`flex flex-col space-y-1 max-w-[80%] ${
													message.role === 'user' ? 'items-end' : 'items-start'
												}`}
											>
												<div
													className={`rounded-lg px-3 py-2 text-sm ${
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
												<div className='flex items-center gap-2 text-xs text-muted-foreground'>
													<span>
														{formatDuration(message.time_in_call_secs)}
													</span>
												</div>
											</div>
											{message.role === 'user' && (
												<Avatar className='size-10 flex justify-center items-center bg-primary-foreground'>
													<User className='size-4' />
												</Avatar>
											)}
										</div>
									))
								) : (
									<div className='text-center text-muted-foreground py-8'>
										No transcript available
									</div>
								)}
							</div>
						</ScrollArea>
					</div>
				</SheetContent>
			)}
		</Sheet>
	)
}

function formatDuration(seconds: number): string {
	if (seconds === 0) return '00:00'
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

function getStatusBadge(status: string) {
	switch (status) {
		case 'in-progress':
			return {
				variant: 'outline' as const,
				icon: <Clock className='h-3 w-3 mr-1' />,
			}
		case 'done':
			return {
				variant: 'secondary' as const,
				icon: <Check className='h-3 w-3 mr-1' />,
			}
		default:
			return { variant: 'outline' as const, icon: null }
	}
}

function getSuccessBadge(success: string) {
	switch (success) {
		case 'success':
			return {
				variant: 'success' as const,
				icon: <Check className='h-3 w-3 mr-1' />,
			}
		case 'failure':
			return {
				variant: 'destructive' as const,
				icon: <X className='h-3 w-3 mr-1' />,
			}
		case 'pending':
			return {
				variant: 'outline' as const,
				icon: <Clock className='h-3 w-3 mr-1' />,
			}
		default:
			return { variant: 'outline' as const, icon: null }
	}
}
