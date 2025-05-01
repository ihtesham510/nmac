import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart'
import NumberFlow from '@number-flow/react'

export interface Props {
	chartConfig: ChartConfig
	chartTitle: string
	chartDescription: string
	buttonTitle?: string
	buttonValue?: number
	data?: any[]
	dataKey: string
}

export function CallChart({
	chartConfig,
	chartTitle,
	chartDescription,
	buttonTitle,
	buttonValue,
	data,
	dataKey,
}: Props) {
	return (
		<Card>
			<CardHeader className='flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row'>
				<div className='grid flex-1 gap-1 text-center sm:text-left'>
					<CardTitle>{chartTitle}</CardTitle>
					<CardDescription>{chartDescription}</CardDescription>
				</div>
				{buttonTitle && (
					<div className='hidden sm:flex'>
						<button
							data-active={false}
							className='relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6'
						>
							<span className='text-xs text-muted-foreground'>
								{buttonTitle}
							</span>
							<span className='text-lg font-bold leading-none sm:text-4xl'>
								{buttonValue && buttonValue > 0 ? (
									<NumberFlow value={buttonValue} />
								) : (
									'0'
								)}
							</span>
						</button>
					</div>
				)}
			</CardHeader>
			<CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
				<ChartContainer
					config={chartConfig}
					className='aspect-auto h-[250px] w-full'
				>
					<AreaChart data={data}>
						<defs>
							<linearGradient
								id={`fill-${dataKey}`}
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='5%'
									stopColor={`var(--color-${dataKey})`}
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor={`var(--color-${dataKey})`}
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey='date'
							tickLine={false}
							axisLine={true}
							tickMargin={8}
							minTickGap={32}
							tickFormatter={value => {
								const date = new Date(value)
								return date.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric',
								})
							}}
						/>
						<ChartTooltip
							cursor={true}
							content={
								<ChartTooltipContent
									labelFormatter={value => {
										return new Date(value).toLocaleDateString('en-US', {
											month: 'short',
											day: 'numeric',
										})
									}}
									indicator='line'
								/>
							}
						/>
						<Area
							dataKey={dataKey}
							type='natural'
							fillOpacity={0.2}
							fill={`url(#fill-${dataKey})`}
							stroke={`var(--color-${dataKey})`}
							stackId='a'
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
