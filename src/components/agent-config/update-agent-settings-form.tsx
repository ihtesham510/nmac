import {
	type GetAgentResponseModel,
	Llm as Models,
} from '@elevenlabs/elevenlabs-js/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import {
	FileIcon,
	FileType,
	Globe,
	LoaderCircle,
	LoaderIcon,
	TrashIcon,
	TriangleAlert,
	WebhookIcon,
	Wrench,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { useElevenLabsClient } from '@/api/client'
import { ConfigSection } from '@/components/configuration-text-area'
import { AddTextForm } from '@/components/project-settings/add-text-form'
import { AddUrlForm } from '@/components/project-settings/add-url-form'
import { SelectSetting } from '@/components/project-settings/select-setting'
import { SliderSetting } from '@/components/project-settings/slider-setting'
import { AddTransferToHumanTool } from '@/components/project-settings/tools/add-transfer-to-human'
import { AddWebhook } from '@/components/project-settings/tools/add-webhook'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useDialog } from '@/hooks/use-dialogs'
import { useKnowledgeBase } from '@/hooks/use-knowledge-base'
import { useUpdateAgent } from '@/hooks/use-update-agent'

export function UpdateAgentSettingsForm({
	data,
}: {
	data: GetAgentResponseModel
}) {
	const updateAgent = useUpdateAgent(data.agentId)
	const client = useElevenLabsClient()
	const { deleteKnowledgeBase } = useKnowledgeBase(client, data)
	const knowledge_base = data.conversationConfig.agent?.prompt?.knowledgeBase
	const tools = data.conversationConfig.agent?.prompt?.tools

	const [dialogs, setDialogs] = useDialog({
		dropdownMenu: false,
		linkDialog: false,
		textDialog: false,
		addTool: false,
		addWebhook: false,
		addTransferToHuman: false,
	})

	const queryClient = useQueryClient()
	const formSchema = z.object({
		first_message: z.string(),
		prompt: z.string(),
		temperature: z.number(),
		llm: z.string(),
		max_duration: z.number(),
		rag: z.boolean().optional(),
	})
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			first_message: data.conversationConfig.agent?.firstMessage,
			prompt: data.conversationConfig.agent?.prompt?.prompt,
			temperature: data.conversationConfig.agent?.prompt?.temperature,
			llm: data.conversationConfig.agent?.prompt?.llm,
			max_duration: data.conversationConfig.conversation?.maxDurationSeconds,
			rag: data.conversationConfig.agent?.prompt?.rag?.enabled,
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await updateAgent.mutateAsync(
			{
				agent: {
					firstMessage: values.first_message,
					prompt: {
						prompt: values.prompt,
						temperature: values.temperature,
						llm: values.llm as Models,
						rag: {
							enabled: values.rag,
						},
					},
				},
				conversation: {
					maxDurationSeconds: values.max_duration,
				},
				...data,
			},
			{
				onSuccess(data) {
					toast.success('Agent Updated')
					queryClient.invalidateQueries({ queryKey: [data.agentId] })
					form.reset(
						{
							first_message: data.conversationConfig.agent?.firstMessage,
							prompt: data.conversationConfig.agent?.prompt?.prompt,
							temperature: data.conversationConfig.agent?.prompt?.temperature,
							llm: data.conversationConfig.agent?.prompt?.llm,
							max_duration:
								data.conversationConfig.conversation?.maxDurationSeconds,
							rag: data.conversationConfig.agent?.prompt?.rag?.enabled,
						},
						{ keepValues: true },
					)
				},
			},
		)
	}

	return (
		<div>
			<AddUrlForm
				data={data}
				open={dialogs.linkDialog}
				onOpenChange={e => setDialogs('linkDialog', e)}
			/>
			<AddTextForm
				data={data}
				open={dialogs.textDialog}
				onOpenChange={e => setDialogs('textDialog', e)}
			/>
			{data && (
				<AddTransferToHumanTool
					open={dialogs.addTransferToHuman}
					onOpenChange={e => setDialogs('addTransferToHuman', e)}
					data={data}
				/>
			)}
			{data && (
				<AddWebhook
					open={dialogs.addWebhook}
					onOpenChange={e => setDialogs('addWebhook', e)}
					data={data}
				/>
			)}
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='mb-60'>
					<div className='relative mb-6 grid gap-6'>
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
												className='max-h-[500px] min-h-[300px] font-mono text-sm'
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
						<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex flex-col gap-1'>
									<h1 className='font-medium text-lg text-white'>
										Knowledge Based
									</h1>
									<p className='mb-4 text-primary/50 text-sm'>
										Provide the LLM with domain-specific information to help it
										answer questions more accurately.
									</p>
								</div>
								<div className='min-w-[200px] p-[20px]'>
									<DropdownMenu
										open={dialogs.dropdownMenu}
										onOpenChange={e => setDialogs('dropdownMenu', e)}
									>
										<DropdownMenuTrigger asChild>
											<Button
												variant='outline'
												type='button'
												className='w-full'
											>
												Add Document
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className='w-max'>
											<DropdownMenuItem
												className='flex items-center gap-2'
												onClick={() => {
													setDialogs('linkDialog', true)
													setDialogs('dropdownMenu', false)
												}}
											>
												<Globe className='size-4' />
												Url
											</DropdownMenuItem>
											<DropdownMenuItem
												className='flex items-center gap-2'
												onClick={() => {
													setDialogs('textDialog', true)
													setDialogs('dropdownMenu', true)
												}}
											>
												<FileType className='size-4' />
												Text
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<div className='grid w-full rounded-lg bg-primary-foreground'>
								{knowledge_base?.map(doc => (
									<div
										className='flex items-center justify-between p-2'
										key={doc.id}
									>
										<div className='flex items-center justify-center gap-4'>
											<Button variant='secondary' size='icon' type='button'>
												{doc.type === 'text' && <FileType className='size-4' />}
												{doc.type === 'url' && <Globe className='size-4' />}
												{doc.type === 'file' && <FileIcon className='size-4' />}
											</Button>
											<p>{doc.name}</p>
										</div>
										<div>
											<Button
												variant='outline'
												size='icon'
												type='button'
												onClick={async () => {
													await deleteKnowledgeBase.mutateAsync(doc.id)
												}}
											>
												<TrashIcon className='size-4' />
											</Button>
										</div>
									</div>
								))}
							</div>
							{knowledge_base?.length !== 0 && (
								<div className='flex items-center justify-between'>
									<div className='flex flex-col gap-1'>
										<h1 className='font-medium text-lg text-white'>Use RAG</h1>
										<p className='mb-4 text-primary/50 text-sm'>
											Retrieval-Augmented Generation (RAG) increases the agent's
											maximum Knowledge Base size. The agent will have access to
											relevant pieces of attached Knowledge Base during answer
											generation.
										</p>
									</div>
									<div className='min-w-[80px] p-[20px]'>
										<FormField
											control={form.control}
											name='rag'
											render={({ field }) => (
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
											)}
										/>
									</div>
								</div>
							)}
						</div>
						<div className='grid gap-4 rounded-lg border border-border bg-card p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex flex-col gap-1'>
									<h1 className='font-medium text-lg text-white'>Tools</h1>
									<p className='mb-4 text-primary/50 text-sm'>
										Provide the agent with tools it can use to help users.
									</p>
								</div>
								<div className='min-w-[200px] p-[20px]'>
									<DropdownMenu
										open={dialogs.addTool}
										onOpenChange={e => setDialogs('addTool', e)}
									>
										<DropdownMenuTrigger asChild>
											<Button
												variant='outline'
												type='button'
												className='w-full'
											>
												Add tools
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent className='w-max'>
											<DropdownMenuItem
												onClick={() => setDialogs('addTransferToHuman', true)}
											>
												Transfer to Human
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => setDialogs('addWebhook', true)}
											>
												Add Webhook
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
							<div className='grid w-full rounded-lg bg-primary-foreground'>
								{tools?.map((tool, i) => (
									<div
										className='flex items-center justify-between p-2'
										key={i}
									>
										<div className='flex items-center justify-center gap-4'>
											<Button variant='secondary' size='icon' type='button'>
												{tool.type === 'system' && (
													<Wrench className='size-4' />
												)}
												{tool.type === 'webhook' && (
													<WebhookIcon className='size-4' />
												)}
											</Button>
											<div className='flex flex-col gap-2'>
												<p>{tool.name}</p>

												{!tool.description ||
													(tool.description === '' && (
														<p className='text-primary/50'>
															{tool.description}
														</p>
													))}
											</div>
										</div>
										<div>
											{/** biome-ignore lint/suspicious/noExplicitAny: <tool can be of type any> */}
											<DeleteToolButton data={data} toolId={(tool as any).id} />
										</div>
									</div>
								))}
							</div>
						</div>
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
											<Input
												type='number'
												className='min-w-[100px]'
												{...field}
											/>
										</SelectSetting>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{form.formState.isDirty && (
							<div className='sticky bottom-6 flex w-full items-center justify-between rounded-lg border border-border bg-background p-4'>
								<div className='flex gap-2'>
									<TriangleAlert className='size-4' />
									<p className='font-semibold text-sm'>Changes Detected</p>
								</div>
								<div className='flex gap-2'>
									<Button
										className='font-semibold text-sm'
										variant='ghost'
										type='reset'
										size='sm'
										onClick={() => form.reset()}
									>
										clear
									</Button>
									<Button
										type='submit'
										className='font-semibold text-sm'
										size='sm'
									>
										{form.formState.isSubmitting ? (
											<LoaderCircle className='m-1 size-4 animate-spin' />
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
		</div>
	)
}

function DeleteToolButton({
	data,
	toolId,
}: {
	data: GetAgentResponseModel
	toolId: string
}) {
	const updateAgent = useUpdateAgent(data.agentId)
	const queryClient = useQueryClient()
	return (
		<Button
			variant='outline'
			size='icon'
			type='button'
			onClick={async () => {
				await updateAgent.mutateAsync(
					{
						agent: {
							prompt: {
								tools: [
									...(data.conversationConfig.agent?.prompt?.tools?.filter(
										// biome-ignore lint/suspicious/noExplicitAny: <tools can be of type any>
										(t: any) => t.id !== toolId,
									) ?? []),
								],
							},
						},
					},
					{
						async onSuccess() {
							await queryClient.invalidateQueries({
								queryKey: ['get_agent', data.agentId],
							})
							toast.success('Tool Removed Successfully')
						},
					},
				)
			}}
		>
			{updateAgent.isPending ? (
				<LoaderIcon className='size-4 animate-spin' />
			) : (
				<TrashIcon className='size-4' />
			)}
		</Button>
	)
}
