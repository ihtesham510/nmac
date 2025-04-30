import { createFileRoute } from '@tanstack/react-router'
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
	LoaderCircle,
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
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMutation, useQuery } from 'convex/react'
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
	DialogTrigger,
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
	const client = useElevenLabsClient()
	const [sheet, setSheet] = useState(false)
	const conv_agents = useTanstackQuery(queries.list_agents(client))
	const createAgent = useMutation(api.agents.createAgent)
	const deleteAgent = useMutation(api.agents.deleteAgent)
	const data = useQuery(api.agents.getAgents, { userId: auth.user!._id })
	const [filter, setFilter] = useState<string>()
	const [dialogs, setDialogs] = useDialog({ alertDelete: false })
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
			<div className='m-10 rounded-md gap-6 grid'>
				<div className='grid gap-2 my-4'>
					<h1 className='text-4xl font-bold'>Agents</h1>
					<h1 className='text-lg font-bold text-primary/30'>
						Create and manage your agents.
					</h1>
				</div>
				{(!data || conv_agents.isLoading) && (
					<div className='w-full h-80 flex justify-center items-center'>
						<LoaderCircle className='size-6' />
					</div>
				)}
				{data && data?.length === 0 && !conv_agents.isLoading && (
					<>
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
					</>
				)}

				{data && data.length > 0 && (
					<>
						<div className='flex justify-between items-center'>
							<div className='relative'>
								<Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
								<Input
									placeholder='Search Clients...'
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
						{agents?.map(agent => (
							<Dialog
								open={dialogs.alertDelete}
								onOpenChange={e => setDialogs('alertDelete', e)}
							>
								<DialogContent>
									<DialogHeader>
										<DialogTitle>Are you absolutely sure?</DialogTitle>
										<DialogDescription>
											This action cannot be undone. This will permanently delete
											your account and remove your data from our servers.
										</DialogDescription>
									</DialogHeader>
									<DialogFooter>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => setDialogs('alertDelete', false)}
											className='cursor-pointer'
										>
											cancel
										</Button>
										<Button
											type='button'
											size='sm'
											className='cursor-pointer'
											onClick={() => {
												deleteAgent({ agentId: agent._id })
												setDialogs('alertDelete', false)
											}}
										>
											Continue
										</Button>
									</DialogFooter>
								</DialogContent>
								<Card>
									<CardHeader>
										<div className='flex justify-between items-start'>
											<div>
												<CardTitle className='text-bold text-2xl'>
													{agent.name}
												</CardTitle>
												<CardDescription className='mt-1'>
													{agent.description}
												</CardDescription>
											</div>
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
															await navigator.clipboard.writeText(agent.agentId)
															toast.success('Agent Id Coppied.')
														}}
													>
														<Copy className='h-4 w-4 mr-2' />
														Copy agent ID
													</DropdownMenuItem>
													<DialogTrigger asChild>
														<DropdownMenuItem>
															<Trash2 className='h-4 w-4 mr-2' />
															Delete agent
														</DropdownMenuItem>
													</DialogTrigger>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardHeader>
									<CardContent className='flex flex-wrap items-center gap-2'>
										{agent.tags.map(tag => (
											<Badge key={tag} variant='secondary' className='text-xs'>
												<Tag className='h-3 w-3 mr-1' />
												{tag}
											</Badge>
										))}
									</CardContent>
									<CardFooter>
										<p className='text-xs text-muted-foreground'>
											Created{' '}
											{format(agent._creationTime, "MMM d, yyyy 'at' h:mm a")}
										</p>
									</CardFooter>
								</Card>
							</Dialog>
						))}
					</>
				)}
			</div>
		</Sheet>
	)
}
