import { Models } from '@/lib/types'
import { createFileRoute } from '@tanstack/react-router'
import { type PropsWithChildren } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { InfoIcon, LoaderCircle, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { useQueryClient } from '@tanstack/react-query'
import { type GetAgentResponseModel } from 'elevenlabs/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import NumberFlow from '@number-flow/react'
import { useUpdateAgent } from '@/hooks/use-update-agent'
import { toast } from 'sonner'
import { useProjetSettings } from '@/context/project-setting-context'
import { ConfigSection } from '@/components/configuration-text-area'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/project-settings/agent')({
	component: RouteComponent,
})

function RouteComponent() {
	const { agent } = useProjetSettings()
	return (
		<div>
			{agent.data && (
				<UpdateAgentForm data={agent.data} key={agent.dataUpdatedAt} />
			)}
		</div>
	)
}

interface SpeechSettingProps {
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

function SliderSetting({
	title,
	description,
	value,
	defaultValue,
	min = 0,
	max = 100,
	step = 1,
	onChange,
	className,
}: SpeechSettingProps) {
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

function SelectSetting(
	props: {
		className?: string
		title: string
		description: string
		child?: {
			className: string
		}
	} & PropsWithChildren,
) {
	return (
		<div
			className={cn(
				'rounded-lg bg-primary-foreground p-4 flex justify-between items-center',
				props.className,
			)}
		>
			<div className='flex flex-col gap-1'>
				<h1 className='text-lg font-medium text-white'>{props.title}</h1>
				<p className='mb-4 text-sm text-primary/50'>{props.description}</p>
			</div>
			<div className={cn('min-w-[200px] p-[20px]', props.child?.className)}>
				{props.children}
			</div>
		</div>
	)
}

function UpdateAgentForm({ data }: { data: GetAgentResponseModel }) {
	const updateAgent = useUpdateAgent(data.agent_id)
	const queryClient = useQueryClient()
	const formSchema = z.object({
		first_message: z.string(),
		prompt: z.string(),
		temperature: z.number(),
		llm: z.string(),
		max_duration: z.number(),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_message: data.conversation_config.agent?.first_message,
			prompt: data.conversation_config.agent?.prompt?.prompt,
			temperature: data.conversation_config.agent?.prompt?.temperature,
			llm: data.conversation_config.agent?.prompt?.llm,
			max_duration: data.conversation_config.conversation?.max_duration_seconds,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await updateAgent.mutateAsync(
			{
				first_message: values.first_message,
				prompt: values.prompt,
				temperature: values.temperature,
				max_duration: values.max_duration,
				model: values.llm as Models,
			},
			{
				onSuccess(data) {
					toast.success('Agent Updated')
					queryClient.invalidateQueries({ queryKey: [data.agent_id] })
					form.reset(
						{
							first_message: data.conversation_config.agent?.first_message,
							prompt: data.conversation_config.agent?.prompt?.prompt,
							temperature: data.conversation_config.agent?.prompt?.temperature,
							llm: data.conversation_config.agent?.prompt?.llm,
							max_duration:
								data.conversation_config.conversation?.max_duration_seconds,
						},
						{ keepValues: true },
					)
				},
			},
		)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='my-5 mb-60'>
				<div className='grid relative gap-6 mb-6'>
					<FormField
						control={form.control}
						name='first_message'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<ConfigSection
										title='First message'
										description='The first message the agent will say. If empty, the agent will wait for the user to start the conversation.'
									>
										<Textarea
											id='first-message'
											className='h-[100px]'
											placeholder="Enter the agent's first message..."
											{...field}
										/>
										<FormMessage />
									</ConfigSection>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='prompt'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<ConfigSection
										title='System prompt'
										description='The system prompt is used to determine the persona of the agent and the context of the conversation.'
										infoTooltip='The system prompt helps define how your AI agent will behave and respond to users.'
									>
										<Textarea
											id='prompt'
											className='min-h-[300px] max-h-[500px] font-mono text-sm'
											placeholder="Enter the agent's prompt here..."
											{...field}
										/>

										<FormMessage />
									</ConfigSection>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='llm'
						render={({ field }) => (
							<FormItem>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectSetting
											title='LLM'
											description='Select which provider and model to use for the LLM.
              If your chosen LLM is not available at the moment or something goes wrong, we will redirect the conversation to another LLM.
                Currently, the LLM cost is covered by us. In the future, this cost will be passed onto you.'
											className='w-full'
										>
											<SelectTrigger id='llm-model'>
												<SelectValue
													placeholder='Select model'
													className='w-full'
												/>
											</SelectTrigger>
										</SelectSetting>
									</FormControl>
									<SelectContent>
										{Object.values(Models).map(model => (
											<SelectItem key={model} value={model}>
												{model}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='temperature'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<SliderSetting
										title='Temperature'
										description='Temperature is a parameter that controls the creativity or randomness of the responses generated by the LLM.'
										min={0}
										max={1}
										step={0.05}
										defaultValue={form.getValues('temperature')}
										value={field.value}
										onChange={([val]) => field.onChange(val)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='max_duration'
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<SelectSetting
										title='Max conversation duration'
										description='The maximum number of seconds that a conversation can last.'
										className='gap-0.5'
									>
										<Input type='number' className='min-w-[100px]' {...field} />
									</SelectSetting>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{form.formState.isDirty && (
						<div className='sticky bg-background p-4 border-border border rounded-lg w-full bottom-6 flex justify-between items-center'>
							<div className='flex gap-2'>
								<TriangleAlert className='size-4' />
								<p className='font-semibold text-sm'>Changes Detected</p>
							</div>
							<div className='flex gap-2'>
								<Button
									className='text-sm font-semibold'
									variant='ghost'
									type='reset'
									size='sm'
									onClick={() => form.reset()}
								>
									clear
								</Button>
								<Button
									type='submit'
									className='text-sm font-semibold'
									size='sm'
								>
									{form.formState.isSubmitting ? (
										<LoaderCircle className='size-4 m-1 animate-spin' />
									) : (
										'save'
									)}
								</Button>
							</div>
						</div>
					)}
				</div>
			</form>
		</Form>
	)
}
