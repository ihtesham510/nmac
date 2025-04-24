import { CallChart } from '@/components/call-chart'
import { createFileRoute } from '@tanstack/react-router'
import React, { useMemo } from 'react'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useQuery } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { LoaderComponent } from '@/components/loader'

export enum TimeRange {
	Week = '7d',
	TenDays = '10d',
	TwentyDays = '20d',
	Month = '30d',
	NintyDays = '90d',
}

export const Route = createFileRoute('/dashboard/analytics')({
	component: RouteComponent,
	async loader({ context: { queryClient } }) {},
	pendingComponent: LoaderComponent,
})

function RouteComponent() {
	const [timeRange, setTimeRange] = React.useState<TimeRange>(
		TimeRange.NintyDays,
	)

	const conversationsList = useQuery(
		queries.list_conversations('UfUwNQ3oHVcoENbzUoVs'),
	)
	const filteredNumberOfCalls = useMemo(() => {
		if (!conversationsList.data) return []

		const dateCount: Record<string, number> = {}
		for (const conv of conversationsList.data.conversations) {
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
	}, [conversationsList.data, timeRange])

	const totalNumberofCalls = useMemo(() => {
		return filteredNumberOfCalls.reduce((acc, item) => (acc += item.calls), 0)
	}, [filteredNumberOfCalls])

	const filteredCallMinutes = useMemo(() => {
		if (!conversationsList.data) return []

		const dateDurationMap: Record<string, number> = {}
		for (const conv of conversationsList.data.conversations) {
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
	}, [conversationsList.data, timeRange])

	const totalNumberofMinutes = useMemo(() => {
		return filteredCallMinutes.reduce((acc, item) => (acc += item.minutes), 0)
	}, [filteredCallMinutes])

	return (
		<div className='m-10 grid gap-6'>
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
					<SelectItem value={TimeRange.NintyDays}>Last 3 months</SelectItem>
					<SelectItem value={TimeRange.Month}>Last 30 days</SelectItem>
					<SelectItem value={TimeRange.TwentyDays}>Last 20 days</SelectItem>
					<SelectItem value={TimeRange.TenDays}>Last 10 days</SelectItem>
					<SelectItem value={TimeRange.Week}>Last 7 days</SelectItem>
				</SelectContent>
			</Select>
			<div className='grid gap-6'>
				<CallChart
					chartTitle='Number of Calls'
					data={filteredNumberOfCalls}
					buttonTitle='Total Calls'
					buttonValue={`${totalNumberofCalls}`}
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
					buttonValue={`${totalNumberofMinutes}`}
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
	)
}
