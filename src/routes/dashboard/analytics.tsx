import { CallChart } from '@/components/call-chart'
import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect, useMemo } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import type { Agent } from '@/lib/types'
import { useLogger } from '@mantine/hooks'
import { LoaderComponent } from '@/components/loader'
import { AgentSelect } from '@/components/select-agent'
import { useAgents } from '@/hooks/use-agents'
import { useElevenLabsClient } from '@/api/client'
import { BotIcon } from 'lucide-react'

export enum TimeRange {
	Week = '7d',
	TenDays = '10d',
	TwentyDays = '20d',
	Month = '30d',
	NintyDays = '90d',
}

export const Route = createFileRoute('/dashboard/analytics')({
	component: RouteComponent,
})

function RouteComponent() {
	const agents = useAgents()
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	const [timeRange, setTimeRange] = React.useState<TimeRange>(
		TimeRange.NintyDays,
	)
	const [selectedAgent, setSelectedAgent] = React.useState<Agent | undefined>(
		undefined,
	)

	const conversationsList = useQuery(
		queries.list_conversations(client, {
			agent_id: selectedAgent?.agentId,
			filter: agents.map(agent => agent.agentId),
		}),
	)

	useEffect(() => {
		queryClient.invalidateQueries({
			queryKey: ['list_conversations'],
		})
	}, [selectedAgent])

	const filteredConversations = useMemo(() => {
		if (!selectedAgent && conversationsList.data) {
			return {
				...conversationsList.data,
				conversations: conversationsList.data!.conversations.filter(conv =>
					agents.map(agent => agent.agentId).includes(conv.agent_id),
				),
			}
		}
		return conversationsList.data
	}, [conversationsList.data, selectedAgent])

	useLogger('analytics', [selectedAgent, filteredConversations, agents])

	const filteredNumberOfCalls = useMemo(() => {
		if (!filteredConversations) return []

		const dateCount: Record<string, number> = {}
		for (const conv of filteredConversations.conversations) {
			const date = new Date(conv.start_time_unix_secs * 1000)
				.toISOString()
				.split('T')[0]
			dateCount[date] = (dateCount[date] || 0) + 1
		}

		const endDate = new Date()
		const daysToSubtract = parseInt(timeRange.replace('d', ''), 10)
		const startDate = new Date()
		startDate.setDate(endDate.getDate() - daysToSubtract)

		const result: { date: string; calls: number }[] = []
		for (
			let d = new Date(startDate);
			d <= endDate;
			d.setDate(d.getDate() + 1)
		) {
			const dateStr = d.toISOString().split('T')[0]
			result.push({
				date: dateStr,
				calls: dateCount[dateStr] || 0,
			})
		}

		return result
	}, [filteredConversations, timeRange])

	const totalNumberofCalls = useMemo(() => {
		return filteredNumberOfCalls.reduce((acc, item) => (acc += item.calls), 0)
	}, [filteredNumberOfCalls])

	const filteredCallMinutes = useMemo(() => {
		if (!filteredConversations) return []

		const dateDurationMap: Record<string, number> = {}
		for (const conv of filteredConversations.conversations) {
			const date = new Date(conv.start_time_unix_secs * 1000)
				.toISOString()
				.split('T')[0]
			dateDurationMap[date] =
				(dateDurationMap[date] || 0) + Math.floor(conv.call_duration_secs / 60)
		}

		const endDate = new Date()
		const daysToSubtract = parseInt(timeRange.replace('d', ''), 10)
		const startDate = new Date()
		startDate.setDate(endDate.getDate() - daysToSubtract)

		const result: { date: string; minutes: number }[] = []
		for (
			let d = new Date(startDate);
			d <= endDate;
			d.setDate(d.getDate() + 1)
		) {
			const dateStr = d.toISOString().split('T')[0]
			result.push({
				date: dateStr,
				minutes: dateDurationMap[dateStr] || 0,
			})
		}

		return result
	}, [filteredConversations, timeRange])

	const totalNumberofMinutes = useMemo(() => {
		if (filteredCallMinutes.length === 0) return 0
		return filteredCallMinutes.reduce((acc, item) => (acc += item.minutes), 0)
	}, [filteredCallMinutes])

	return (
		<div className='grid m-10 gap-10'>
			<span className='grid gap-2'>
				<h1 className='text-4xl font-bold'>Analytics</h1>
				<h2 className='font-semibold text-primary/50'>
					See call analytics for your agents.
				</h2>
			</span>
			{agents.length === 0 && !conversationsList.isLoading && (
				<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-primary-foreground mt-4'>
					<div className='bg-muted/50 p-4 rounded-full mb-4'>
						<BotIcon className='h-10 w-10 text-muted-foreground' />
					</div>
					<h2 className='text-xl font-semibold mb-2'>No Agents found</h2>
					<p className='text-muted-foreground text-center max-w-md mb-8'>
						You haven't added any agents yet. Add agent to see analytics.
					</p>
				</div>
			)}
			{conversationsList.isLoading && <LoaderComponent />}
			{!conversationsList.isLoading &&
				agents.length !== 0 &&
				!conversationsList.isError &&
				conversationsList.data && (
					<div className='grid gap-6'>
						<div className='flex items-center justify-end gap-4'>
							<AgentSelect
								agents={agents}
								value={selectedAgent ?? null}
								className='w-[200px]'
								placeholder='All Agents'
								onSelect={agent => setSelectedAgent(agent)}
							/>

							<Select
								value={timeRange}
								onValueChange={e => setTimeRange(e as TimeRange)}
							>
								<SelectTrigger
									className='w-[160px] rounded-lg sm:ml-auto'
									aria-label='Select a value'
								>
									<SelectValue placeholder='Last 3 months' />
								</SelectTrigger>
								<SelectContent className='rounded-xl'>
									<SelectItem value={TimeRange.NintyDays}>
										Last 3 months
									</SelectItem>
									<SelectItem value={TimeRange.Month}>Last 30 days</SelectItem>
									<SelectItem value={TimeRange.TwentyDays}>
										Last 20 days
									</SelectItem>
									<SelectItem value={TimeRange.TenDays}>
										Last 10 days
									</SelectItem>
									<SelectItem value={TimeRange.Week}>Last 7 days</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className='grid gap-6'>
							<CallChart
								chartTitle='Number of Calls'
								data={filteredNumberOfCalls}
								buttonTitle='Total Calls'
								buttonValue={totalNumberofCalls}
								chartDescription='Total number of calls made each day.'
								dataKey='calls'
								chartConfig={{
									calls: {
										label: 'calls',
										color: 'hsl(var(--chart-3))',
									},
								}}
							/>
							<CallChart
								chartTitle='Total Call Minutes'
								data={filteredCallMinutes}
								dataKey='minutes'
								buttonTitle='Total Munites'
								buttonValue={totalNumberofMinutes}
								chartDescription='The total number of minutes spent on calls each day.'
								chartConfig={{
									minutes: {
										label: 'minutes',
										color: 'hsl(var(--chart-2))',
									},
								}}
							/>
						</div>
					</div>
				)}
		</div>
	)
}
