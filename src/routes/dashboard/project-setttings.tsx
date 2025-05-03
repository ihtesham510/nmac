import { AgentSelect } from '@/components/select-agent'
import { ProtectedClientRoute } from '@/hoc/protected-client-route'
import { useAgents } from '@/hooks/use-agents'
import { Models, type Agent } from '@/lib/types'
import { createFileRoute } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { BotIcon } from 'lucide-react'
import { useElevenLabsClient } from '@/api/client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queries } from '@/api/query-options'
import { type GetAgentResponseModel } from 'elevenlabs/api'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import NumberFlow from '@number-flow/react'
import { Button } from '@/components/ui/button'
import { LoaderComponent } from '@/components/loader'
import { useUpdateAgent } from '@/hooks/use-update-agent'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/project-setttings')({
	component: () => (
		<ProtectedClientRoute>
			<RouteComponent />
		</ProtectedClientRoute>
	),
})

function RouteComponent() {
	const agents = useAgents()
	const client = useElevenLabsClient()
	const queryClient = useQueryClient()
	const [selectedAgent, setSelectedAgent] = React.useState<Agent | undefined>(
		undefined,
	)
	const agent = useQuery(
		queries.get_agent(client, { id: selectedAgent?.agentId, enabled: false }),
	)
	useEffect(() => {
		if (agents && agents.length > 0) {
			setSelectedAgent(agents[0])
		}
	}, [agents])

	useEffect(() => {
		if (selectedAgent) {
			agent.refetch()
			queryClient.invalidateQueries({ queryKey: [selectedAgent.agentId] })
		}
	}, [selectedAgent])

	return (
		<div className='w-full h-screen'>
			<div className='m-10 grid gap-6 space-y-6'>
				<div>
					<h1 className='text-4xl font-bold'>Project Settings</h1>
					<p className='text-primary/50 font-bold'>
						Mange your agent settings and configurations.
					</p>
				</div>
				{agents.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg bg-primary-foreground mt-4'>
						<div className='bg-muted/50 p-4 rounded-full mb-4'>
							<BotIcon className='h-10 w-10 text-muted-foreground' />
						</div>
						<h2 className='text-xl font-semibold mb-2'>No Agents found</h2>
						<p className='text-muted-foreground text-center max-w-md mb-8'>
							You haven't added any agents yet. Add agent to see analytics.
						</p>
					</div>
				) : (
					<div className='grid gap-6'>
						<AgentSelect
							agents={agents}
							value={selectedAgent ?? null}
							className='w-[200px]'
							placeholder='All Agents'
							onSelect={agent => setSelectedAgent(agent)}
						/>
						{agent.isLoading && <LoaderComponent className='h-[50vh]' />}
						{agent.data && !agent.isLoading && (
							<UpdateAgentForm key={agent.data.agent_id} data={agent.data} />
						)}
					</div>
				)}
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

	useEffect(() => {
		form.reset({
			first_message: data.conversation_config.agent?.first_message,
			prompt: data.conversation_config.agent?.prompt?.prompt,
			temperature: data.conversation_config.agent?.prompt?.temperature,
			llm: data.conversation_config.agent?.prompt?.llm,
			max_duration: data.conversation_config.conversation?.max_duration_seconds,
		})
	}, [data])

	async function onSubmit(values: z.infer<typeof formSchema>) {
		updateAgent.mutate(
			{
				first_message: values.first_message,
				prompt: values.prompt,
				temperature: values.temperature,
				max_duration: values.max_duration,
				model: values.llm as Models,
			},
			{
				onSuccess() {
					toast.success('Agent Updated')
					queryClient.invalidateQueries({ queryKey: [data.agent_id] })
				},
			},
		)
	}
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='h-[110vh] w-full'>
				<div className='grid relative grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
					<div className='lg:col-span-2'>
						<div className='space-y-4'>
							<div className='flex flex-col gap-2'>
								<FormField
									control={form.control}
									name='first_message'
									render={({ field }) => (
										<FormItem>
											<FormLabel>First Message</FormLabel>
											<FormControl>
												<Textarea
													id='first-message'
													className='h-[100px]'
													placeholder="Enter the agent's first message..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<FormField
									control={form.control}
									name='prompt'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Agent Prompt</FormLabel>
											<FormControl>
												<Textarea
													id='prompt'
													className='min-h-[300px] max-h-[500px] font-mono text-sm'
													placeholder="Enter the agent's prompt here..."
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
					</div>

					<div className='space-y-6'>
						<div className='space-y-4'>
							<h3 className='text-base font-medium'>Model Settings</h3>

							<FormField
								control={form.control}
								name='llm'
								render={({ field }) => (
									<FormItem>
										<FormLabel htmlFor='llm-model'>LLM Model</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger id='llm-model'>
													<SelectValue placeholder='Select model' />
												</SelectTrigger>
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
										<FormLabel
											htmlFor='temperature'
											className='flex justify-between items-center'
										>
											Temperature{' '}
											<NumberFlow value={form.getValues('temperature')} />
										</FormLabel>
										<FormControl>
											<Slider
												id='temperature'
												min={0}
												max={1}
												step={0.05}
												value={[field.value]}
												onValueChange={([val]) => field.onChange(val)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className='space-y-4'>
							<h3 className='text-base font-medium'>Conversation Settings</h3>
							<FormField
								control={form.control}
								name='max_duration'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='flex justify-between items-center'>
											Max Duration (Seconds).
										</FormLabel>
										<FormControl>
											<Input type='number' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					{form.formState.isDirty && (
						<div className='fixed bottom-4 left-[calc(50%+8rem)] transform -translate-x-1/2 z-50 w-[60vw] max-w-[calc(100vw-16rem)]'>
							<div className='bg-muted border border-border shadow-lg py-3 rounded-xl flex items-center justify-between px-6 animate-in fade-in slide-in-from-bottom-2'>
								<span className='text-sm text-muted-foreground font-medium'>
									Unsaved Changes
								</span>
								<div className='flex gap-2'>
									<Button
										size='sm'
										type='reset'
										variant='ghost'
										disabled={form.formState.isSubmitting}
										onClick={() => form.reset()}
									>
										Clear
									</Button>
									<Button
										size='sm'
										type='submit'
										disabled={form.formState.isSubmitting}
									>
										Save
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</form>
		</Form>
	)
}
