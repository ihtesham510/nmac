import type { ConversationSummaryResponseModel } from '@elevenlabs/elevenlabs-js/api'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { format, fromUnixTime } from 'date-fns'
import {
	ArrowUpDown,
	Calendar,
	Check,
	Clock,
	Filter,
	MessageSquare,
	Search,
	User,
	X,
} from 'lucide-react'
import React, { useState } from 'react'
import { useElevenLabsClient } from '@/api/client'
import { queries } from '@/api/query-options'
import { LoaderComponent } from '@/components/loader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
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
	const router = useRouter()
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
		<React.Fragment>
			<Outlet />
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
												<TableRow
													key={call.conversationId}
													className='cursor-pointer'
													onClick={() =>
														router.navigate({
															to: '/dashboard/history/$conversation',
															params: {
																conversation: call.conversationId,
															},
														})
													}
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
		</React.Fragment>
	)
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
