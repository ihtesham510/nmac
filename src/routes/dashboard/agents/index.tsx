import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import {
	Bot,
	Copy,
	LinkIcon,
	MoreHorizontal,
	PlusIcon,
	Search,
	Tag,
	Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useQuery as useTanstackQuery } from '@tanstack/react-query'
import { rabinKarpSearch } from '@/lib/utils'
import { toast } from 'sonner'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useMutation } from 'convex/react'
import { useQuery } from '@/cache/useQuery'
import { api } from 'convex/_generated/api'
import { useAuth } from '@/context/auth-context'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { TagsInput } from '@/components/ui/tags-input'
import { Textarea } from '@/components/ui/textarea'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '@/components/ui/select'
import { queries } from '@/api/query-options'
import { format } from 'date-fns'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useDialog } from '@/hooks/use-dialogs'
import { useElevenLabsClient } from '@/api/client'

export const Route = createFileRoute('/dashboard/agents/')({
	component: RouteComponent,
})

const formSchema = z.object({
	agent_name: z.string().min(1).min(2),
	agent_id: z.string().min(4),
	agent_description: z.string().min(0),
	agent_tags: z.array(z.string()).nonempty('Please at least one item'),
})

function RouteComponent() {
	const auth = useAuth()
	const navigate = useNavigate()
	const client = useElevenLabsClient()
	const [sheet, setSheet] = useState(false)
	const conv_agents = useTanstackQuery(queries.list_agents(client))
	const createAgent = useMutation(api.agents.createAgent)
	const deleteAgent = useMutation(api.agents.deleteAgent)
	const data = useQuery(api.agents.getAgents, { userId: auth.user!._id })
	const [filter, setFilter] = useState<string>()
	const [dialogs, setDialogs] = useDialog({ alertDelete: false })
	const [selectedAgent, setSelectedAgent] = useState<any>(null)

	const agents = useMemo(() => {
		if (data && (!filter || filter === '')) {
			return data
		}
		return data?.filter(agent =>
			rabinKarpSearch(agent.name.toLowerCase(), filter!),
		)
	}, [data, filter])

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			agent_tags: [],
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			if (auth.user) {
				await createAgent({
					name: values.agent_name,
					description: values.agent_description,
					userId: auth.user?._id,
					tags: values.agent_tags,
					agentId: values.agent_id,
				})
				form.reset()
				setSheet(false)
			}
		} catch (error) {
			toast.error('Error while importing agent. Please try again.')
		}
	}

	const handleDeleteClick = (agent: any) => {
		setSelectedAgent(agent)
		setDialogs('alertDelete', true)
	}

	const handleDeleteConfirm = () => {
		if (selectedAgent) {
			deleteAgent({ agentId: selectedAgent._id })
			setDialogs('alertDelete', false)
			setSelectedAgent(null)
		}
	}

	return (
		<Sheet open={sheet} onOpenChange={e => setSheet(e)}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className='text-xl font-semibold'>Add Agent</SheetTitle>
				</SheetHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-8 px-4'
					>
						<FormField
							control={form.control}
							name='agent_name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Name</FormLabel>
									<FormControl>
										<Input placeholder='agent name' type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='agent_id'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Select Agent</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className='w-full'>
												<SelectValue placeholder='Select Agent To import' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{conv_agents.data?.agents.map(agent => (
												<SelectItem value={agent.agent_id}>
													{agent.name}
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
							name='agent_description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder='A small description for agent'
											className='resize-none'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='agent_tags'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Agent Tags</FormLabel>
									<FormControl>
										<TagsInput
											value={field.value}
											onValueChange={field.onChange}
											placeholder='Enter your tags'
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full flex gap-2'>
							<PlusIcon className='size-4' />
							Add
						</Button>
					</form>
				</Form>
			</SheetContent>

			<Dialog
				open={dialogs.alertDelete}
				onOpenChange={e => setDialogs('alertDelete', e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							agent and remove your data from our servers.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={() => {
								setDialogs('alertDelete', false)
								setSelectedAgent(null)
							}}
							className='cursor-pointer'
						>
							Cancel
						</Button>
						<Button
							type='button'
							size='sm'
							variant='destructive'
							className='cursor-pointer'
							onClick={handleDeleteConfirm}
						>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<div className='m-10 rounded-md gap-6 grid'>
				<div className='grid gap-2 my-4'>
					<h1 className='text-4xl font-bold'>Agents</h1>
					<h1 className='text-lg font-bold text-primary/30'>
						Create and manage your agents.
					</h1>
				</div>

				{!data && conv_agents.isLoading && (
					<>
						<div className='flex justify-between items-center'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search Agents...'
									disabled
									className='pl-8 w-[400px]'
								/>
							</div>
							<Button disabled className='flex gap-2'>
								<PlusIcon />
								<p className='hidden lg:inline'>Create Agent</p>
							</Button>
						</div>

						<div className='border rounded-lg'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='px-4'>Name</TableHead>
										<TableHead className='hidden md:flex items-center'>
											Description
										</TableHead>
										<TableHead>Tags</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{Array.from({ length: 5 }).map((_, index) => (
										<TableRow key={index}>
											<TableCell className='px-4'>
												<Skeleton className='h-4 w-[150px]' />
											</TableCell>
											<TableCell className='hidden md:flex items-center'>
												<Skeleton className='h-4 w-[250px]' />
											</TableCell>
											<TableCell>
												<div className='flex gap-1'>
													<Skeleton className='h-5 w-[60px] rounded-full' />
													<Skeleton className='h-5 w-[80px] rounded-full' />
													<Skeleton className='h-5 w-[70px] rounded-full' />
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className='h-4 w-[100px]' />
											</TableCell>
											<TableCell>
												<Skeleton className='h-8 w-8 rounded-md' />
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}

				{data && data?.length === 0 && !conv_agents.isLoading && (
					<div className='flex flex-col items-center justify-center py-16 px-4 rounded-lg'>
						<div className='bg-muted/50 p-4 rounded-full mb-4'>
							<Bot className='h-10 w-10 text-muted-foreground' />
						</div>
						<h2 className='text-xl font-semibold mb-2'>No agents found</h2>
						<p className='text-muted-foreground text-center max-w-md mb-8'>
							You haven't created any agents yet. Add a new agent to get
							started.
						</p>
						<SheetTrigger>
							<Button>
								<PlusIcon className='size-4' />
								Add Agent
							</Button>
						</SheetTrigger>
					</div>
				)}

				{data && data.length > 0 && (
					<>
						<div className='flex justify-between items-center'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search Agents...'
									onChange={e => setFilter(e.target.value)}
									className='pl-8 w-[400px]'
								/>
							</div>
							<SheetTrigger>
								<TooltipProvider>
									<Tooltip delayDuration={1000}>
										<TooltipTrigger>
											<Button className='flex gap-2'>
												<PlusIcon />
												<p className='hidden lg:inline'>Create Agent</p>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>Add Agent</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</SheetTrigger>
						</div>

						<div className='border rounded-lg'>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className='px-4'>Name</TableHead>
										<TableHead className='hidden md:flex items-center'>
											Description
										</TableHead>
										<TableHead>Tags</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{agents?.map(agent => (
										<TableRow
											key={agent._id}
											className='cursor-pointer'
											onClick={() =>
												navigate({
													to: '/dashboard/agents/$agent/agent',
													params: { agent: agent.agentId },
												})
											}
										>
											<TableCell className='font-medium px-4'>
												{agent.name}
											</TableCell>
											<TableCell className='max-w-[300px] hidden md:table-cell items-center truncate'>
												{agent.description}
											</TableCell>
											<TableCell>
												<div className='flex flex-wrap gap-1'>
													{agent.tags.slice(0, 3).map(tag => (
														<Badge
															key={tag}
															variant='secondary'
															className='text-xs'
														>
															<Tag className='h-3 w-3 mr-1' />
															{tag}
														</Badge>
													))}
													{agent.tags.length > 3 && (
														<Badge variant='outline' className='text-xs'>
															+{agent.tags.length - 3}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell className='text-sm text-muted-foreground'>
												{format(agent._creationTime, 'MMM d, yyyy')}
											</TableCell>
											<TableCell onClick={e => e.stopPropagation()}>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															size='icon'
															className='h-8 w-8'
														>
															<MoreHorizontal className='h-4 w-4' />
															<span className='sr-only'>Open menu</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end'>
														<DropdownMenuItem
															onClick={async () => {
																await navigator.clipboard.writeText(
																	agent.agentId,
																)
																toast.success('Agent ID copied.')
															}}
														>
															<Copy className='h-4 w-4 mr-2' />
															Copy agent ID
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={async () => {
																await navigator.clipboard.writeText(
																	`${window.location.host}/agents/${agent._id}`,
																)
																toast.success('Link copied.')
															}}
														>
															<LinkIcon className='h-4 w-4 mr-2' />
															Copy Link
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteClick(agent)}
															className='text-destructive'
														>
															<Trash2 className='h-4 w-4 mr-2' />
															Delete agent
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
		</Sheet>
	)
}
