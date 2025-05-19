import { cn } from '@/lib/utils'
import NumberFlow from '@number-flow/react'
import { Slider } from '@/components/ui/slider'
import {
	TooltipProvider,
	TooltipTrigger,
	TooltipContent,
	Tooltip,
} from '@/components/ui/tooltip'
import { InfoIcon } from 'lucide-react'

interface SliderSettingProps {
	title: string
	description: string
	value: number
	defaultValue: number
	min?: number
	max?: number
	step?: number
	onChange: (value: number[]) => void
	className?: string
}

export function SliderSetting({
	title,
	description,
	value,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	onChange,
	className,
}: SliderSettingProps) {
	return (
		<div className={cn('rounded-lg bg-primary-foreground p-4', className)}>
			<div className='mb-2 flex justify-between items-center'>
				<div className='flex items-center gap-1.5'>
					<h3 className='text-base font-medium text-white'>{title}</h3>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<InfoIcon className='h-4 w-4 text-zinc-400' />
							</TooltipTrigger>
							<TooltipContent side='top' className='max-w-xs'>
								{description}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<p className='font-semibold text-md'>
					<NumberFlow value={value} />
				</p>
			</div>
			<p className='mb-4 text-sm text-primary/50'>{description}</p>
			<Slider
				value={[value]}
				defaultValue={[defaultValue]}
				max={max}
				min={min}
				step={step}
				onValueChange={onChange}
				className='py-1'
			/>
		</div>
	)
}
